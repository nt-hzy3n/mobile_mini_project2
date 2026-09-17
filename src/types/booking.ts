import { Building } from './room';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g., '07:30'
  endTime: string;   // e.g., '09:30'
  label: string;     // e.g., '07:30 – 09:30'
  durationHours: number; // e.g., 2
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: number;
  roomType: string;
  date: string; // YYYY-MM-DD
  dateDisplay: string; // Thứ Ba, 17/09/2026
  timeSlot: TimeSlot;
  userId: string;
  userName: string;
  studentId: string;
  createdAt: string;
  status: BookingStatus;
  notificationId?: string;
}

export interface QRPayload {
  bookingId: string;
  roomId: string;
  date: string;
  timeSlot: string;
}
