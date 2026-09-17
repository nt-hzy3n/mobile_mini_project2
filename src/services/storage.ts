import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/booking';
import { UserProfile } from '../types/user';

const STORAGE_KEYS = {
  USER_SESSION: '@vku_user_session',
  BOOKINGS: '@vku_bookings_list',
} as const;

/**
 * An toàn lưu trữ thông tin sinh viên vào AsyncStorage
 */
export async function saveUser(user: UserProfile): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, jsonValue);
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu thông tin người dùng vào AsyncStorage:', error);
    return false;
  }
}

/**
 * Đọc thông tin sinh viên từ AsyncStorage, xử lý dữ liệu lỗi/corrupt an toàn
 */
export async function getUser(): Promise<UserProfile | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!jsonValue) {
      return null;
    }
    const parsed = JSON.parse(jsonValue);
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
      return parsed as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Dữ liệu phiên đăng nhập bị lỗi hoặc corrupt, trả về null:', error);
    return null;
  }
}

/**
 * Xóa thông tin sinh viên khi đăng xuất
 */
export async function removeUser(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa phiên đăng nhập:', error);
    return false;
  }
}

/**
 * Lưu danh sách các lượt đặt phòng vào AsyncStorage
 */
export async function saveBookings(bookings: Booking[]): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(bookings);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, jsonValue);
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu danh sách đặt phòng:', error);
    return false;
  }
}

/**
 * Lấy danh sách lượt đặt phòng từ AsyncStorage, tự phục hồi nếu dữ liệu corrupt
 */
export async function getBookings(): Promise<Booking[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!jsonValue) {
      return [];
    }
    const parsed = JSON.parse(jsonValue);
    if (Array.isArray(parsed)) {
      return parsed as Booking[];
    }
    console.warn('Dữ liệu bookings không phải mảng, khởi tạo mảng rỗng');
    return [];
  } catch (error) {
    console.warn('Lỗi phân tích JSON danh sách bookings hoặc corrupt, trả về mảng rỗng:', error);
    return [];
  }
}

/**
 * Xóa toàn bộ lịch sử đặt phòng (phục vụ mục đích dọn dẹp hoặc test)
 */
export async function clearBookings(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa danh sách đặt phòng:', error);
    return false;
  }
}
