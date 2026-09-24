import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../stores/useBookingStore';

type RoomDetailRouteProp = RouteProp<RootStackParamList, 'RoomDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<RoomDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { room } = route.params;

  const setSelectedRoom = useBookingStore((state) => state.setSelectedRoom);

  const isAvailable = room.status === 'available';

  const handleBookPress = () => {
    setSelectedRoom(room);
    navigation.navigate('Booking', { room });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent={true} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Hình ảnh lớn */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.bannerImage} resizeMode="cover" />

          {/* Nút quay lại */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Badge trạng thái */}
          <View
            style={[
              styles.statusBadge,
              isAvailable ? styles.statusAvailable : styles.statusInUse,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isAvailable ? THEME.colors.success : THEME.colors.danger },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isAvailable ? THEME.colors.success : THEME.colors.danger },
              ]}
            >
              {isAvailable ? 'Đang trống' : 'Đang được sử dụng'}
            </Text>
          </View>
        </View>

        {/* Nội dung chi tiết */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomSubtitle}>{room.type} tiêu chuẩn VKU</Text>
            </View>
            <View style={styles.buildingBadge}>
              <Text style={styles.buildingText}>Tòa {room.building}</Text>
              <Text style={styles.floorText}>Tầng {room.floor}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Các thông số cơ bản */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="people" size={24} color={THEME.colors.primary} />
              <Text style={styles.statLabel}>Sức chứa</Text>
              <Text style={styles.statValue}>{room.capacity} người</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="business" size={24} color={THEME.colors.secondary} />
              <Text style={styles.statLabel}>Vị trí</Text>
              <Text style={styles.statValue}>Tòa {room.building} - Tầng {room.floor}</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time" size={24} color={THEME.colors.accent} />
              <Text style={styles.statLabel}>Thời lượng</Text>
              <Text style={styles.statValue}>2 giờ / ca</Text>
            </View>
          </View>

          {/* Trang thiết bị */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trang thiết bị phòng học</Text>
            <View style={styles.equipmentList}>
              {room.equipment.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={THEME.colors.success}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.equipmentName}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mô tả phòng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả phòng</Text>
            <Text style={styles.descriptionText}>{room.description}</Text>
          </View>

          {/* Quy định sử dụng phòng học VKU */}
          <View style={styles.rulesCard}>
            <View style={styles.rulesHeader}>
              <Ionicons name="shield-checkmark" size={20} color={THEME.colors.secondary} />
              <Text style={styles.rulesTitle}>Quy định sử dụng phòng học VKU</Text>
            </View>
            <Text style={styles.ruleItem}>• Có mặt đúng khung giờ đã đăng ký và quét mã QR check-in.</Text>
            <Text style={styles.ruleItem}>• Giữ gìn vệ sinh chung, bảo quản thiết bị máy móc cẩn thận.</Text>
            <Text style={styles.ruleItem}>• Tắt điều hòa và các thiết bị điện trước khi rời khỏi phòng.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Thanh nút bấm Đặt phòng cố định ở chân trang */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookPress}
          activeOpacity={0.88}
        >
          <Text style={styles.bookButtonText}>Đặt phòng</Text>
          <Ionicons name="arrow-forward" size={20} color={THEME.colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  statusAvailable: {
    backgroundColor: THEME.colors.successLight,
  },
  statusInUse: {
    backgroundColor: THEME.colors.dangerLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: THEME.spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomName: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  roomSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  buildingBadge: {
    alignItems: 'flex-end',
    backgroundColor: THEME.colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
  },
  buildingText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  floorText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: THEME.spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 6,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  equipmentList: {
    gap: 10,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentName: {
    fontSize: 14,
    color: THEME.colors.text,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  rulesCard: {
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 75, 145, 0.15)',
    marginBottom: 40,
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  ruleItem: {
    fontSize: 13,
    color: THEME.colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomBar: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    ...THEME.shadows.md,
  },
  bookButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...THEME.shadows.md,
  },
  bookButtonText: {
    color: THEME.colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
