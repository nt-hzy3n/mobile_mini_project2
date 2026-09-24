import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../services/storage';
import { Booking } from '../types/booking';
import { refreshBookingsStatus } from '../utils/booking';

/**
 * Fetch bookings from AsyncStorage and refresh statuses.
 */
async function fetchBookings(): Promise<Booking[]> {
  const stored = await getBookings();
  return refreshBookingsStatus(stored);
}

/**
 * TanStack Query hook for booking data.
 * Works alongside Zustand for mutations (create/cancel booking).
 * Provides automatic caching, deduplication, and background refresh.
 */
export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
