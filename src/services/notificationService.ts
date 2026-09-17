import { Platform } from 'react-native';
import { Booking } from '../types/booking';

let Notifications: typeof import('expo-notifications') | null = null;

// Kiểm tra xem có đang chạy trong Expo Go trên Android không
// Expo Go từ SDK 53 đã loại bỏ hỗ trợ native notifications trên Android, yêu cầu development build
let isExpoGoAndroid = false;
try {
  const Constants = require('expo-constants')?.default || require('expo-constants');
  const appOwnership = Constants?.appOwnership;
  const executionEnvironment = Constants?.executionEnvironment;
  isExpoGoAndroid =
    Platform.OS === 'android' &&
    (appOwnership === 'expo' || executionEnvironment === 'storeClient');
} catch {
  isExpoGoAndroid = false;
}

if (!isExpoGoAndroid && Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications');
    if (Notifications?.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  } catch (error) {
    console.warn('Không thể khởi tạo expo-notifications trong môi trường hiện tại:', error);
    Notifications = null;
  }
}

/**
 * Yêu cầu quyền thông báo từ người dùng một cách an toàn
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!Notifications || Platform.OS === 'web' || isExpoGoAndroid) {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Lỗi khi kiểm tra/yêu cầu quyền thông báo (không crash app):', error);
    return false;
  }
}

/**
 * Lên lịch thông báo trước 15 phút cho một booking
 * Trả về notificationId nếu thành công, undefined nếu không thể tạo hoặc bắt đầu < 15 phút
 */
export async function scheduleBookingReminder(booking: Booking): Promise<string | undefined> {
  if (!Notifications || Platform.OS === 'web' || isExpoGoAndroid) {
    console.log(
      `[Thông báo]: Đã ghi nhận lịch nhắc phòng ${booking.roomName} trước 15 phút (mô phỏng trong môi trường Expo Go).`
    );
    return `mock-notif-${booking.id}`;
  }

  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Người dùng không cấp quyền thông báo, bỏ qua schedule notification');
      return undefined;
    }

    // Phân tách ngày và giờ bắt đầu
    const [year, month, day] = booking.date.split('-').map(Number);
    const [hours, minutes] = booking.timeSlot.startTime.split(':').map(Number);

    const bookingStartTime = new Date(year, month - 1, day, hours, minutes, 0);
    const reminderTime = new Date(bookingStartTime.getTime() - 15 * 60 * 1000);
    const now = new Date();

    // Nếu thời gian nhắc nhở đã qua hoặc lịch bắt đầu trong vòng < 15 phút
    if (reminderTime.getTime() <= now.getTime()) {
      console.log(
        `Lịch đặt phòng ${booking.roomName} bắt đầu trong vòng dưới 15 phút hoặc đã qua, không lên lịch nhắc nhở.`
      );
      return undefined;
    }

    const secondsUntilReminder = Math.floor((reminderTime.getTime() - now.getTime()) / 1000);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc lịch đặt phòng',
        body: `${booking.roomName} của bạn sẽ bắt đầu sau 15 phút.`,
        data: {
          bookingId: booking.id,
          roomId: booking.roomId,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, secondsUntilReminder),
        repeats: false,
      },
    });

    console.log(`Đã lên lịch thông báo thành công cho booking ${booking.id} (ID: ${notificationId})`);
    return notificationId;
  } catch (error) {
    console.warn('Lỗi khi lên lịch thông báo nhắc nhở (không gây crash app):', error);
    return undefined;
  }
}

/**
 * Hủy thông báo nhắc nhở khi người dùng hủy booking
 */
export async function cancelBookingReminder(notificationId?: string): Promise<void> {
  if (!notificationId || !Notifications || Platform.OS === 'web' || isExpoGoAndroid) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Đã hủy thông báo nhắc nhở ${notificationId}`);
  } catch (error) {
    console.warn(`Lỗi khi hủy thông báo ${notificationId}:`, error);
  }
}
