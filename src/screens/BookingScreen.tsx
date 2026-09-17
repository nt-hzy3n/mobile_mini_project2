import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DateSelector } from '../components/DateSelector';
import { TimeSlotSelector } from '../components/TimeSlotSelector';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../stores/useBookingStore';
import { formatDateToVietnamese } from '../utils/date';

type BookingRouteProp = RouteProp<RootStackParamList, 'Booking'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BookingScreen: React.FC = () => {
  const route = useRoute<BookingRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { room } = route.params;

  const bookings = useBookingStore((state) => state.bookings);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot);
  const setSelectedRoom = useBookingStore((state) => state.setSelectedRoom);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedTimeSlot = useBookingStore((state) => state.setSelectedTimeSlot);
  const loadBookings = useBookingStore((state) => state.loadBookings);

  useEffect(() => {
    setSelectedRoom(room);
    loadBookings();
  }, [room, setSelectedRoom, loadBookings]);

  const handleContinue = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Chưa chọn khung giờ', 'Vui lòng chọn một khung giờ còn trống để tiếp tục.');
      return;
    }
    navigation.navigate('BookingConfirm');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Header thanh điều hướng */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn lịch đặt phòng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tóm tắt thông tin phòng đã chọn */}
        <View style={styles.roomSummaryCard}>
          <View style={styles.roomIconBox}>
            <Ionicons name="business" size={24} color={THEME.colors.secondary} />
          </View>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomLocation}>
              Tòa {room.building} • Tầng {room.floor} • Sức chứa {room.capacity} người
            </Text>
          </View>
        </View>

        {/* 1. Chọn ngày (7 ngày tiếp theo) */}
        <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        {/* 2. Chọn khung giờ (4 khung giờ cố định) */}
        <TimeSlotSelector
          roomId={room.id}
          selectedDate={selectedDate}
          selectedSlot={selectedTimeSlot}
          bookings={bookings}
          onSelectSlot={setSelectedTimeSlot}
        />

        {/* Thông tin tóm tắt lựa chọn hiện tại */}
        {selectedTimeSlot ? (
          <View style={styles.selectionSummaryCard}>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar" size={18} color={THEME.colors.primary} />
              <Text style={styles.summaryText}>
                Ngày: <Text style={styles.boldText}>{formatDateToVietnamese(selectedDate)}</Text>
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time" size={18} color={THEME.colors.primary} />
              <Text style={styles.summaryText}>
                Khung giờ: <Text style={styles.boldText}>{selectedTimeSlot.label}</Text>
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Thanh nút Tiếp tục cố định ở chân trang */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedTimeSlot && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedTimeSlot}
          activeOpacity={0.88}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
          <Ionicons name="arrow-forward" size={20} color={THEME.colors.textInverse} />
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
  },
  roomSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 12,
    ...THEME.shadows.sm,
  },
  roomIconBox: {
    width: 48,
    height: 48,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  roomLocation: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  selectionSummaryCard: {
    backgroundColor: THEME.colors.primaryLight,
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(243, 112, 33, 0.25)',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 13,
    color: THEME.colors.text,
  },
  boldText: {
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  bottomBar: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    ...THEME.shadows.md,
  },
  continueButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonDisabled: {
    backgroundColor: THEME.colors.borderStrong,
  },
  continueButtonText: {
    color: THEME.colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
