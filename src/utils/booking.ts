import { Booking, QRPayload } from '../types/booking';
import { isSlotEnded } from './date';

/**
 * Kiểm tra xem một khung giờ cụ thể của phòng trong ngày đã có ai đặt chưa
 * (Chỉ tính các booking có trạng thái 'upcoming')
 */
export function isSlotBooked(
  roomId: string,
  date: string,
  slotId: string,
  bookings: Booking[]
): boolean {
  return bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.timeSlot.id === slotId &&
      b.status === 'upcoming'
  );
}

/**
 * Kiểm tra xung đột trước khi tạo booking mới (Conflict Engine)
 */
export function validateBookingConflict(
  roomId: string,
  date: string,
  slotId: string,
  bookings: Booking[]
): { hasConflict: boolean; message?: string } {
  const conflict = isSlotBooked(roomId, date, slotId, bookings);
  if (conflict) {
    return {
      hasConflict: true,
      message: 'Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác.',
    };
  }
  return { hasConflict: false };
}

/**
 * Tự động cập nhật trạng thái các booking đã qua thời gian kết thúc thành 'completed'
 */
export function refreshBookingsStatus(bookings: Booking[]): Booking[] {
  return bookings.map((booking) => {
    if (booking.status === 'upcoming' && isSlotEnded(booking.date, booking.timeSlot.endTime)) {
      return {
        ...booking,
        status: 'completed' as const,
      };
    }
    return booking;
  });
}

/**
 * Tạo mã đặt phòng chuyên nghiệp VKU
 * Ví dụ: VKU-A101-1709-X8K2
 */
export function generateBookingCode(roomName: string, dateString: string): string {
  const cleanRoom = roomName.replace(/\s+/g, '').toUpperCase();
  const dateParts = dateString.split('-');
  const shortDate = `${dateParts[2] || '01'}${dateParts[1] || '01'}`;
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VKU-${cleanRoom}-${shortDate}-${randomSuffix}`;
}

/**
 * Tạo chuỗi QR Payload chuẩn
 * Không chứa thông tin cá nhân nhạy cảm
 */
export function createQRPayload(booking: Booking): string {
  const payload: QRPayload = {
    bookingId: booking.id,
    roomId: booking.roomId,
    date: booking.date,
    timeSlot: booking.timeSlot.label,
  };
  return JSON.stringify(payload);
}
