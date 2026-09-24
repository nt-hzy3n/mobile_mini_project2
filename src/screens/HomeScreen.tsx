import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const localAvatar = require('../../assets/avatar.jpg');
import { EmptyState } from '../components/EmptyState';
import { FilterChips } from '../components/FilterChips';
import { RoomCard } from '../components/RoomCard';
import { THEME } from '../constants/theme';
import { useRooms } from '../hooks/useRooms';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/useAuthStore';
import { filterRooms, useRoomStore } from '../stores/useRoomStore';
import { Room } from '../types/room';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Animated wrapper for each room card with fade-in + slide-up effect.
 */
const AnimatedRoomItem: React.FC<{
  item: Room;
  index: number;
  onPress: (room: Room) => void;
}> = React.memo(({ item, index, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const delay = index * 80; // Stagger animation per card
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <RoomCard room={item} onPress={onPress} />
    </Animated.View>
  );
});
AnimatedRoomItem.displayName = 'AnimatedRoomItem';

/**
 * Animated pulsing dot for real-time indicator.
 */
const PulsingDot: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.realtimePulse,
        { transform: [{ scale: pulseAnim }] },
      ]}
    />
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = useAuthStore((state) => state.currentUser);

  // TanStack Query: Fetch & cache room data
  const { data: queryRooms, isLoading: isQueryLoading } = useRooms();

  // Zustand: UI filters & local state
  const rooms = useRoomStore((state) => state.rooms);
  const searchQuery = useRoomStore((state) => state.searchQuery);
  const selectedBuilding = useRoomStore((state) => state.selectedBuilding);
  const selectedCapacity = useRoomStore((state) => state.selectedCapacity);
  const selectedEquipments = useRoomStore((state) => state.selectedEquipments);
  const setSearchQuery = useRoomStore((state) => state.setSearchQuery);
  const resetFilters = useRoomStore((state) => state.resetFilters);
  const initAvailabilityListener = useRoomStore((state) => state.initAvailabilityListener);

  // Header fade-in animation
  const headerFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [headerFade]);

  // Lắng nghe cập nhật trạng thái phòng theo thời gian thực (Mock Real-time)
  useEffect(() => {
    const cleanup = initAvailabilityListener();
    return cleanup;
  }, [initAvailabilityListener]);

  // Merge TanStack Query data with Zustand's real-time status updates
  const mergedRooms = useMemo(() => {
    if (!queryRooms) return rooms;
    // Use Zustand rooms as primary (has real-time status), fallback to query data
    return rooms;
  }, [rooms, queryRooms]);

  // Tối ưu hóa danh sách phòng lọc bằng useMemo để đảm bảo 60fps scrolling
  const filteredData = useMemo(() => {
    return filterRooms(
      mergedRooms,
      searchQuery,
      selectedBuilding,
      selectedCapacity,
      selectedEquipments
    );
  }, [mergedRooms, searchQuery, selectedBuilding, selectedCapacity, selectedEquipments]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetail', { room });
    },
    [navigation]
  );

  const renderRoomItem = useCallback(
    ({ item, index }: { item: Room; index: number }) => {
      return <AnimatedRoomItem item={item} index={index} onPress={handleRoomPress} />;
    },
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Header chính mang phong cách VKU - with fade animation */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.headerTop}>
          <View style={styles.userProfileHeader}>
            <Image source={localAvatar} style={styles.headerAvatar} />
            <View>
              <Text style={styles.brandTitle}>ĐẶT PHÒNG HỌC VKU</Text>
              <Text style={styles.greetingText}>
                Xin chào, {currentUser ? currentUser.name : 'Nguyễn Thị Huyền'} 👋
              </Text>
            </View>
          </View>
          <View style={styles.vkuLogoBadge}>
            <Text style={styles.vkuLogoText}>VKU</Text>
          </View>
        </View>

        {/* Ô tìm kiếm hoạt động ngay khi người dùng gõ */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={THEME.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên phòng, mã phòng, tòa nhà..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>

      {/* Loading state from TanStack Query */}
      {isQueryLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách phòng...</Text>
        </View>
      ) : (
        /* Danh sách phòng với FlatList và bộ lọc */
        <FlatList
          data={filteredData}
          keyExtractor={keyExtractor}
          renderItem={renderRoomItem}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <FilterChips />
              <View style={styles.resultsInfoRow}>
                <Text style={styles.resultsCount}>
                  Tìm thấy <Text style={styles.highlightCount}>{filteredData.length}</Text> phòng
                </Text>
                <View style={styles.realtimeBadge}>
                  <PulsingDot />
                  <Text style={styles.realtimeText}>Thời gian thực</Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="business-outline"
              title="Không tìm thấy phòng phù hợp"
              description="Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bỏ bớt các điều kiện lọc tòa nhà, sức chứa, thiết bị."
              actionText="Xóa bộ lọc"
              onAction={resetFilters}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
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
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  userProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primary,
    letterSpacing: 0.8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.text,
    marginTop: 2,
  },
  vkuLogoBadge: {
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
  },
  vkuLogoText: {
    color: THEME.colors.textInverse,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: THEME.colors.text,
  },
  listHeader: {
    paddingBottom: THEME.spacing.xs,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  resultsCount: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  highlightCount: {
    color: THEME.colors.text,
    fontWeight: '700',
  },
  realtimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 5,
  },
  realtimePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.success,
  },
  realtimeText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
});


