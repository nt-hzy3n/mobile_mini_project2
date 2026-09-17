import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/useAuthStore';
import { useBookingStore } from '../stores/useBookingStore';
import { formatDateToVietnamese } from '../utils/date';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const currentUser = useAuthStore((state) => state.currentUser);
  const selectedRoom = useBookingStore((state) => state.selectedRoom);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot);
  const isSubmitting = useBookingStore((state) => state.isSubmitting);
  const createBooking = useBookingStore((state) => state.createBooking);

  if (!selectedRoom || !selectedTimeSlot || !currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Thiếu thông tin đặt phòng. Vui lòng thử lại.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirm = async () => {
    const result = await createBooking(currentUser);

    if (!result.success) {
      // Báo lỗi xung đột nếu có
      Alert.alert('Không thể đặt phòng', result.error || 'Có lỗi xảy ra khi tạo lịch đặt.', [
        {
          text: 'Chọn khung giờ khác',
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }

    if (result.booking) {
      // Chuyển sang màn hình thành công
      navigation.replace('BookingSuccess', { booking: result.booking });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đặt phòng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Card thông tin chi tiết */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin lịch đặt</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Phòng:</Text>
            <Text style={styles.valueHighlight}>{selectedRoom.name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vị trí:</Text>
            <Text style={styles.value}>
              Tòa {selectedRoom.building} • Tầng {selectedRoom.floor}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày:</Text>
            <Text style={styles.value}>{formatDateToVietnamese(selectedDate)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Thời gian:</Text>
            <Text style={styles.valueHighlight}>{selectedTimeSlot.label}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Thời lượng:</Text>
            <Text style={styles.value}>{selectedTimeSlot.durationHours} giờ</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.cardTitle}>Thông tin người đặt</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Người đặt:</Text>
            <Text style={styles.value}>{currentUser.name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mã sinh viên:</Text>
            <Text style={styles.value}>{currentUser.studentId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{currentUser.email}</Text>
          </View>
        </View>

        {/* Lưu ý thông báo */}
        <View style={styles.noticeCard}>
          <Ionicons name="notifications-outline" size={20} color={THEME.colors.secondary} />
          <Text style={styles.noticeText}>
            Hệ thống sẽ tự động gửi thông báo nhắc nhở trước khi bắt đầu sử dụng phòng 15 phút.
          </Text>
        </View>
      </ScrollView>

      {/* Nút xác nhận đặt phòng ở chân trang */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={isSubmitting}
          activeOpacity={0.88}
        >
          {isSubmitting ? (
            <ActivityIndicator color={THEME.colors.textInverse} size="small" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Xác nhận đặt phòng</Text>
              <Ionicons name="checkmark-circle" size={20} color={THEME.colors.textInverse} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
    marginBottom: THEME.spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  valueHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.lg,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.secondaryLight,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 75, 145, 0.15)',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.secondary,
    lineHeight: 18,
  },
  bottomBar: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    ...THEME.shadows.md,
  },
  confirmButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: THEME.colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: THEME.colors.danger,
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
