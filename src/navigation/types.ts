import { Booking } from '../types/booking';
import { Room } from '../types/room';

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetail: { room: Room };
  Booking: { room: Room };
  BookingConfirm: undefined;
  BookingSuccess: { booking: Booking };
  BookingDetail: { bookingId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  MyBookingsTab: undefined;
  ProfileTab: undefined;
};
