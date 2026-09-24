import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../stores/useBookingStore';
import { Booking, BookingStatus } from '../types/booking';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabKey = 'upcoming' | 'completed' | 'cancelled';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'completed', label: 'Đã hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

  const bookings = useBookingStore((state) => state.bookings);
  const loadBookings = useBookingStore((state) => state.loadBookings);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  const handleBookingPress = useCallback(
    (booking: Booking) => {
      navigation.navigate('BookingDetail', { bookingId: booking.id });
    },
    [navigation]
  );

  const renderBookingItem = useCallback(
    ({ item }: { item: Booking }) => {
      return <BookingCard booking={item} onPress={handleBookingPress} />;
    },
    [handleBookingPress]
  );

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  // Đếm số lượng booking cho mỗi tab
  const counts = useMemo(() => {
    return {
      upcoming: bookings.filter((b) => b.status === 'upcoming').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch đặt phòng</Text>
        <Text style={styles.headerSubtitle}>Quản lý các phòng học bạn đã đặt tại VKU</Text>
      </View>

      {/* Thanh 3 Tabs: Sắp tới, Đã hoàn thành, Đã hủy */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {count > 0 ? (
                <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                  <Text style={[styles.countText, isActive && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Danh sách Booking FlatList */}
      <FlatList
        data={filteredBookings}
        keyExtractor={keyExtractor}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={
              activeTab === 'upcoming'
                ? 'calendar-outline'
                : activeTab === 'completed'
                ? 'checkmark-done-circle-outline'
                : 'close-circle-outline'
            }
            title={
              activeTab === 'upcoming'
                ? 'Chưa có lịch đặt sắp tới'
                : activeTab === 'completed'
                ? 'Chưa có lịch đã hoàn thành'
                : 'Chưa có lịch đặt nào bị hủy'
            }
            description={
              activeTab === 'upcoming'
                ? 'Hãy khám phá các phòng học và phòng máy hiện đại tại VKU để đặt lịch học nhóm ngay hôm nay.'
                : 'Các ca học sau khi kết thúc hoặc hủy sẽ được lưu trữ tự động tại đây.'
            }
            actionText={activeTab === 'upcoming' ? 'Đặt phòng ngay' : undefined}
            onAction={
              activeTab === 'upcoming'
                ? () => navigation.navigate('MainTabs')
                : undefined
            }
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSecondary,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.secondary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  tabLabelActive: {
    color: THEME.colors.textInverse,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: THEME.colors.borderStrong,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.borderRadius.full,
  },
  countBadgeActive: {
    backgroundColor: THEME.colors.primary,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  countTextActive: {
    color: THEME.colors.textInverse,
  },
  listContent: {
    paddingVertical: THEME.spacing.md,
    paddingBottom: 24,
  },
});
