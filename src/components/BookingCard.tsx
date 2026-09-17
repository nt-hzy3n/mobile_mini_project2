import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../constants/theme';
import { Booking } from '../types/booking';

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = React.memo(
  ({ booking, onPress }) => {
    let statusLabel = 'Sắp tới';
    let statusColor = THEME.colors.primary;
    let statusBg = THEME.colors.primaryLight;

    if (booking.status === 'completed') {
      statusLabel = 'Đã hoàn thành';
      statusColor = THEME.colors.success;
      statusBg = THEME.colors.successLight;
    } else if (booking.status === 'cancelled') {
      statusLabel = 'Đã hủy';
      statusColor = THEME.colors.danger;
      statusBg = THEME.colors.dangerLight;
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(booking)}
        activeOpacity={0.85}
      >
        <View style={styles.headerRow}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{booking.roomName}</Text>
            <Text style={styles.roomLocation}>
              Tòa {booking.building} • Tầng {booking.floor}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={15} color={THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{booking.dateDisplay || booking.date}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={15} color={THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{booking.timeSlot.label}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.codeLabel}>Mã đặt phòng:</Text>
          <Text style={styles.codeText}>{booking.id}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

BookingCard.displayName = 'BookingCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  roomLocation: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: THEME.colors.text,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceSecondary,
  },
  codeLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.secondary,
    fontVariant: ['tabular-nums'],
  },
});
