import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QRBookingPass } from '../components/QRBookingPass';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../stores/useBookingStore';

type BookingDetailRouteProp = RouteProp<RootStackParamList, 'BookingDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BookingDetailScreen: React.FC = () => {
  const route = useRoute<BookingDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { bookingId } = route.params;

  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin đặt phòng.</Text>
          <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isUpcoming = booking.status === 'upcoming';

  const handleCancelPress = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    const result = await cancelBooking(booking.id);
    setIsCancelling(false);
    setConfirmModalVisible(false);

    if (result.success) {
      Alert.alert('Thông báo', 'Đã hủy đặt phòng', [
        {
          text: 'Đồng ý',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Lỗi', result.message);
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
        <Text style={styles.headerTitle}>Chi tiết đặt phòng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Vé QR Booking Pass */}
        <QRBookingPass booking={booking} />

        {/* Trạng thái hiện tại */}
        <View style={styles.statusBox}>
          <Text style={styles.statusBoxLabel}>Trạng thái phiếu:</Text>
          <View
            style={[
              styles.statusTag,
              booking.status === 'upcoming'
                ? styles.statusUpcoming
                : booking.status === 'completed'
                ? styles.statusCompleted
                : styles.statusCancelled,
            ]}
          >
            <Text
              style={[
                styles.statusTagText,
                booking.status === 'upcoming'
                  ? styles.statusTextUpcoming
                  : booking.status === 'completed'
                  ? styles.statusTextCompleted
                  : styles.statusTextCancelled,
              ]}
            >
              {booking.status === 'upcoming'
                ? 'Sắp tới'
                : booking.status === 'completed'
                ? 'Đã hoàn thành'
                : 'Đã hủy đặt phòng'}
            </Text>
          </View>
        </View>

        {/* Nút Hủy đặt phòng (chỉ hiện khi booking chưa bắt đầu) */}
        {isUpcoming ? (
          <View style={styles.cancelActionContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelPress}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={18} color={THEME.colors.danger} />
              <Text style={styles.cancelButtonText}>Hủy đặt phòng</Text>
            </TouchableOpacity>
            <Text style={styles.cancelNotice}>
              Sau khi hủy, khung giờ này sẽ được giải phóng để sinh viên khác có thể sử dụng.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Dialog / Modal xác nhận hủy theo đúng yêu cầu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmDialog}>
            <View style={styles.dialogIconCircle}>
              <Ionicons name="warning" size={32} color={THEME.colors.danger} />
            </View>
            <Text style={styles.dialogTitle}>Hủy đặt phòng</Text>
            <Text style={styles.dialogMessage}>
              Bạn có chắc muốn hủy đặt phòng này?
            </Text>

            <View style={styles.dialogButtonsRow}>
              <TouchableOpacity
                style={styles.dialogBackButton}
                onPress={() => setConfirmModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogBackButtonText}>Quay lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dialogCancelButton}
                onPress={handleConfirmCancel}
                disabled={isCancelling}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogCancelButtonText}>
                  {isCancelling ? 'Đang hủy...' : 'Hủy đặt phòng'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: THEME.spacing.lg,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginVertical: THEME.spacing.md,
  },
  statusBoxLabel: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
  },
  statusUpcoming: {
    backgroundColor: THEME.colors.primaryLight,
  },
  statusCompleted: {
    backgroundColor: THEME.colors.successLight,
  },
  statusCancelled: {
    backgroundColor: THEME.colors.dangerLight,
  },
  statusTagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusTextUpcoming: {
    color: THEME.colors.primary,
  },
  statusTextCompleted: {
    color: THEME.colors.success,
  },
  statusTextCancelled: {
    color: THEME.colors.danger,
  },
  cancelActionContainer: {
    marginVertical: THEME.spacing.lg,
    alignItems: 'center',
    paddingBottom: 32,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.danger,
    backgroundColor: THEME.colors.dangerLight,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: THEME.borderRadius.md,
    width: '100%',
  },
  cancelButtonText: {
    color: THEME.colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelNotice: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmDialog: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...THEME.shadows.lg,
  },
  dialogIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 6,
  },
  dialogMessage: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    lineHeight: 20,
  },
  dialogButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogBackButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  dialogCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textInverse,
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
  },
  backBtnAction: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
