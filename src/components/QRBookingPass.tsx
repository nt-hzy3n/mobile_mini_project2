import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { THEME } from '../constants/theme';
import { Booking } from '../types/booking';
import { createQRPayload } from '../utils/booking';

interface QRBookingPassProps {
  booking: Booking;
}

export const QRBookingPass: React.FC<QRBookingPassProps> = ({ booking }) => {
  const qrValue = createQRPayload(booking);

  return (
    <View style={styles.ticketCard}>
      {/* Phần đỉnh thẻ - Header VKU */}
      <View style={styles.ticketHeader}>
        <View style={styles.schoolBadge}>
          <Text style={styles.schoolName}>ĐẠI HỌC CNTT & TRUYỀN THÔNG VIỆT - HÀN</Text>
          <Text style={styles.passTitle}>VÉ SỬ DỤNG PHÒNG HỌC</Text>
        </View>
      </View>

      {/* Phần thân vé */}
      <View style={styles.ticketBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Phòng</Text>
            <Text style={styles.infoValueHighlight}>{booking.roomName}</Text>
          </View>
          <View style={styles.infoColRight}>
            <Text style={styles.infoLabel}>Vị trí</Text>
            <Text style={styles.infoValue}>
              Tòa {booking.building} • Tầng {booking.floor}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Ngày sử dụng</Text>
            <Text style={styles.infoValue}>{booking.dateDisplay || booking.date}</Text>
          </View>
          <View style={styles.infoColRight}>
            <Text style={styles.infoLabel}>Khung giờ</Text>
            <Text style={styles.infoValueHighlight}>{booking.timeSlot.label}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Người đặt</Text>
            <Text style={styles.infoValue}>{booking.userName}</Text>
          </View>
          <View style={styles.infoColRight}>
            <Text style={styles.infoLabel}>Mã sinh viên</Text>
            <Text style={styles.infoValue}>{booking.studentId}</Text>
          </View>
        </View>

        {/* Đường cắt vé - Ticket Notch Divider */}
        <View style={styles.notchContainer}>
          <View style={[styles.notch, styles.notchLeft]} />
          <View style={styles.dashedLine} />
          <View style={[styles.notch, styles.notchRight]} />
        </View>

        {/* Khu vực QR Check-in */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>QR Check-in</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrValue}
              size={180}
              color={THEME.colors.secondaryDark}
              backgroundColor="white"
            />
          </View>
          <Text style={styles.codeTitle}>Mã đặt phòng</Text>
          <Text style={styles.codeValue}>{booking.id}</Text>
          <View style={styles.qrNote}>
            <Ionicons name="information-circle-outline" size={15} color={THEME.colors.textMuted} />
            <Text style={styles.qrNoteText}>
              Quét mã tại cửa phòng hoặc xuất trình cho quản lý tòa nhà
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.lg,
    marginVertical: THEME.spacing.md,
  },
  ticketHeader: {
    backgroundColor: THEME.colors.secondary,
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    alignItems: 'center',
  },
  schoolBadge: {
    alignItems: 'center',
  },
  schoolName: {
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  passTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textInverse,
    letterSpacing: 1,
  },
  ticketBody: {
    padding: THEME.spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  infoColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  infoValueHighlight: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  notchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
    position: 'relative',
    height: 30,
    marginHorizontal: -THEME.spacing.xl,
  },
  notch: {
    width: 20,
    height: 30,
    backgroundColor: THEME.colors.background,
    position: 'absolute',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  notchLeft: {
    left: -1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderLeftWidth: 0,
  },
  notchRight: {
    right: -1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 0,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: THEME.colors.borderStrong,
    marginHorizontal: 25,
  },
  qrSection: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  qrWrapper: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
    marginBottom: THEME.spacing.md,
  },
  codeTitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.secondary,
    letterSpacing: 1,
    marginTop: 2,
  },
  qrNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
  },
  qrNoteText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    flex: 1,
  },
});
