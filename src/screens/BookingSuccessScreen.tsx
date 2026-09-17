import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { QRBookingPass } from '../components/QRBookingPass';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';

type BookingSuccessRouteProp = RouteProp<RootStackParamList, 'BookingSuccess'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BookingSuccessScreen: React.FC = () => {
  const route = useRoute<BookingSuccessRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { booking } = route.params;

  const handleGoToMyBookings = () => {
    // Chuyển hướng sang Tab "Lịch đặt phòng"
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
    // Sử dụng setTimeout ngắn hoặc navigate trực tiếp để chọn tab
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Biểu tượng thành công */}
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={64} color={THEME.colors.success} />
          </View>
          <Text style={styles.successTitle}>Đặt phòng thành công!</Text>
          <Text style={styles.successSubtitle}>
            Thông tin đặt phòng đã được ghi nhận. Vui lòng lưu lại mã vé hoặc chụp màn hình mã QR để làm thủ tục check-in.
          </Text>
        </View>

        {/* Thẻ vé QR Booking Pass */}
        <QRBookingPass booking={booking} />

        {/* Nút hành động */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoToMyBookings}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryButtonText}>Xem lịch đặt phòng</Text>
            <Ionicons name="calendar-outline" size={20} color={THEME.colors.textInverse} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: THEME.spacing.xl,
    paddingBottom: THEME.spacing.md,
  },
  iconCircle: {
    marginBottom: THEME.spacing.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  successSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: THEME.spacing.md,
  },
  actionsContainer: {
    marginVertical: THEME.spacing.xl,
    gap: 12,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...THEME.shadows.md,
  },
  primaryButtonText: {
    color: THEME.colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  secondaryButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
