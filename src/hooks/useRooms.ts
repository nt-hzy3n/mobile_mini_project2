import { useQuery } from '@tanstack/react-query';
import { INITIAL_ROOMS } from '../data/rooms';
import { Room } from '../types/room';

/**
 * Simulate an async API call to fetch rooms.
 * In production this would call a REST/GraphQL endpoint.
 */
async function fetchRooms(): Promise<Room[]> {
  // Simulate network latency (200-400ms)
  await new Promise((resolve) => setTimeout(resolve, 300));
  return INITIAL_ROOMS;
}

/**
 * TanStack Query hook for room data.
 * Provides automatic caching, background refetching, and stale-while-revalidate.
 */
export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
    refetchOnWindowFocus: false,
    refetchInterval: 60_000, // Auto-refetch every 60s for real-time feel
  });
}
