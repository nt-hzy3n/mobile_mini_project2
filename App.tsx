import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/stores/useAuthStore';
import { useBookingStore } from './src/stores/useBookingStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000,
    },
  },
});

export default function App() {
  const loadSession = useAuthStore((state) => state.loadSession);
  const loadBookings = useBookingStore((state) => state.loadBookings);

  useEffect(() => {
    // Tải thông tin phiên sinh viên và lịch đặt phòng từ AsyncStorage khi mở app
    loadSession();
    loadBookings();
  }, [loadSession, loadBookings]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

