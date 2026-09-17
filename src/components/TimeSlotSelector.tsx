import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../constants/theme';
import { TIME_SLOTS } from '../data/timeSlots';
import { Booking, TimeSlot } from '../types/booking';
import { isSlotBooked } from '../utils/booking';
import { isSlotEnded } from '../utils/date';

interface TimeSlotSelectorProps {
  roomId: string;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: TimeSlot | null;
  bookings: Booking[];
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  roomId,
  selectedDate,
  selectedSlot,
  bookings,
  onSelectSlot,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn khung giờ sử dụng</Text>
        <Text style={styles.subtitle}>Thời lượng mỗi ca: 2 giờ</Text>
      </View>

      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot) => {
          // Kiểm tra xem slot đã có ai đặt chưa
          const isBooked = isSlotBooked(roomId, selectedDate, slot.id, bookings);
          // Kiểm tra nếu slot đã kết thúc trong quá khứ của ngày hôm nay
          const isPast = isSlotEnded(selectedDate, slot.endTime);
          const isDisabled = isBooked || isPast;

          const isSelected = selectedSlot?.id === slot.id;

          let statusLabel = 'Có thể đặt';
          let statusColor = THEME.colors.success;
          let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle-outline';

          if (isBooked) {
            statusLabel = 'Đã được đặt';
            statusColor = THEME.colors.danger;
            iconName = 'close-circle-outline';
          } else if (isPast) {
            statusLabel = 'Không khả dụng';
            statusColor = THEME.colors.textMuted;
            iconName = 'time-outline';
          } else if (isSelected) {
            statusLabel = 'Đang chọn';
            statusColor = THEME.colors.primary;
            iconName = 'radio-button-on';
          }

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isDisabled && styles.slotCardDisabled,
              ]}
              disabled={isDisabled}
              onPress={() => onSelectSlot(slot)}
              activeOpacity={0.8}
            >
              <View style={styles.slotTopRow}>
                <Ionicons
                  name={isDisabled ? iconName : isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={isDisabled ? statusColor : isSelected ? THEME.colors.primary : THEME.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.slotTime,
                    isSelected && styles.slotTimeSelected,
                    isDisabled && styles.slotTimeDisabled,
                  ]}
                >
                  {slot.label}
                </Text>
              </View>

              <View style={styles.slotStatusRow}>
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
                <Text
                  style={[
                    styles.slotStatusText,
                    { color: statusColor },
                    isSelected && styles.slotStatusSelected,
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  header: {
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  slotsGrid: {
    gap: 12,
  },
  slotCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...THEME.shadows.sm,
  },
  slotCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  slotCardDisabled: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderColor: THEME.colors.border,
    opacity: 0.65,
  },
  slotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  slotTimeSelected: {
    color: THEME.colors.primary,
  },
  slotTimeDisabled: {
    color: THEME.colors.textMuted,
  },
  slotStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  slotStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  slotStatusSelected: {
    fontWeight: '700',
  },
});
