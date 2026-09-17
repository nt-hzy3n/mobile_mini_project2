import { create } from 'zustand';
import { cancelBookingReminder, scheduleBookingReminder } from '../services/notificationService';
import { getBookings, saveBookings } from '../services/storage';
import { Booking, TimeSlot } from '../types/booking';
import { Room } from '../types/room';
import { UserProfile } from '../types/user';
import {
  generateBookingCode,
  isSlotBooked,
  refreshBookingsStatus,
  validateBookingConflict,
} from '../utils/booking';
import { formatDateToVietnamese, getNext7Days } from '../utils/date';

interface BookingResult {
  success: boolean;
  booking?: Booking;
  error?: string;
}

interface BookingState {
  bookings: Booking[];
  selectedRoom: Room | null;
  selectedDate: string; // YYYY-MM-DD
  selectedTimeSlot: TimeSlot | null;
  isLoading: boolean;
  isSubmitting: boolean;

  // Selection Actions
  setSelectedRoom: (room: Room | null) => void;
  setSelectedDate: (dateString: string) => void;
  setSelectedTimeSlot: (slot: TimeSlot | null) => void;
  resetBookingSelection: () => void;

  // Booking Actions
  loadBookings: () => Promise<void>;
  createBooking: (user: UserProfile) => Promise<BookingResult>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; message: string }>;
  isSlotAvailable: (roomId: string, date: string, slotId: string) => boolean;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedRoom: null,
  selectedDate: getNext7Days()[0]?.dateString || '',
  selectedTimeSlot: null,
  isLoading: false,
  isSubmitting: false,

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  setSelectedDate: (dateString) => set({ selectedDate: dateString, selectedTimeSlot: null }),

  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),

  resetBookingSelection: () =>
    set({
      selectedRoom: null,
      selectedDate: getNext7Days()[0]?.dateString || '',
      selectedTimeSlot: null,
    }),

  loadBookings: async () => {
    set({ isLoading: true });
    try {
      const stored = await getBookings();
      const updated = refreshBookingsStatus(stored);
      // Lưu lại nếu có trạng thái được cập nhật
      if (JSON.stringify(stored) !== JSON.stringify(updated)) {
        await saveBookings(updated);
      }
      set({ bookings: updated, isLoading: false });
    } catch (error) {
      console.warn('Lỗi khi nạp danh sách đặt phòng:', error);
      set({ bookings: [], isLoading: false });
    }
  },

  createBooking: async (user: UserProfile): Promise<BookingResult> => {
    const { selectedRoom, selectedDate, selectedTimeSlot, bookings } = get();

    if (!selectedRoom || !selectedDate || !selectedTimeSlot) {
      return {
        success: false,
        error: 'Vui lòng chọn đầy đủ phòng, ngày và khung giờ đặt.',
      };
    }

    set({ isSubmitting: true });

    // 1. KIỂM TRA XUNG ĐỘT (Conflict Prevention Engine)
    const conflictCheck = validateBookingConflict(
      selectedRoom.id,
      selectedDate,
      selectedTimeSlot.id,
      bookings
    );

    if (conflictCheck.hasConflict) {
      set({ isSubmitting: false });
      return {
        success: false,
        error:
          conflictCheck.message ||
          'Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác.',
      };
    }

    // 2. Tạo Booking mới
    const bookingId = generateBookingCode(selectedRoom.name, selectedDate);
    const dateDisplay = formatDateToVietnamese(selectedDate);

    const newBooking: Booking = {
      id: bookingId,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      building: selectedRoom.building,
      floor: selectedRoom.floor,
      roomType: selectedRoom.type,
      date: selectedDate,
      dateDisplay,
      timeSlot: selectedTimeSlot,
      userId: user.id,
      userName: user.name,
      studentId: user.studentId,
      createdAt: new Date().toISOString(),
      status: 'upcoming',
    };

    // 3. Lên lịch thông báo trước 15 phút
    try {
      const notificationId = await scheduleBookingReminder(newBooking);
      if (notificationId) {
        newBooking.notificationId = notificationId;
      }
    } catch (e) {
      console.warn('Không thể tạo thông báo nhắc nhở:', e);
    }

    // 4. Lưu vào Store & AsyncStorage
    const updatedBookings = [newBooking, ...bookings];
    set({ bookings: updatedBookings, isSubmitting: false });
    await saveBookings(updatedBookings);

    return {
      success: true,
      booking: newBooking,
    };
  },

  cancelBooking: async (bookingId: string) => {
    const { bookings } = get();
    const targetBooking = bookings.find((b) => b.id === bookingId);

    if (!targetBooking) {
      return { success: false, message: 'Không tìm thấy thông tin đặt phòng này.' };
    }

    // Hủy notification nếu có
    if (targetBooking.notificationId) {
      await cancelBookingReminder(targetBooking.notificationId);
    }

    const updatedBookings: Booking[] = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    );

    set({ bookings: updatedBookings });
    await saveBookings(updatedBookings);

    return { success: true, message: 'Đã hủy đặt phòng thành công.' };
  },

  isSlotAvailable: (roomId: string, date: string, slotId: string): boolean => {
    const { bookings } = get();
    return !isSlotBooked(roomId, date, slotId, bookings);
  },
}));
