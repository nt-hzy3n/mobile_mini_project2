import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const localAvatar = require('../../assets/avatar.jpg');
import { EmptyState } from '../components/EmptyState';
import { FilterChips } from '../components/FilterChips';
import { RoomCard } from '../components/RoomCard';
import { THEME } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/useAuthStore';
import { filterRooms, useRoomStore } from '../stores/useRoomStore';
import { Room } from '../types/room';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = useAuthStore((state) => state.currentUser);

  const rooms = useRoomStore((state) => state.rooms);
  const searchQuery = useRoomStore((state) => state.searchQuery);
  const selectedBuilding = useRoomStore((state) => state.selectedBuilding);
  const selectedCapacity = useRoomStore((state) => state.selectedCapacity);
  const selectedEquipments = useRoomStore((state) => state.selectedEquipments);
  const setSearchQuery = useRoomStore((state) => state.setSearchQuery);
  const resetFilters = useRoomStore((state) => state.resetFilters);
  const initAvailabilityListener = useRoomStore((state) => state.initAvailabilityListener);

  // Lắng nghe cập nhật trạng thái phòng theo thời gian thực (Mock Real-time)
  useEffect(() => {
    const cleanup = initAvailabilityListener();
    return cleanup;
  }, [initAvailabilityListener]);

  // Tối ưu hóa danh sách phòng lọc bằng useMemo để đảm bảo 60fps scrolling
  const filteredData = useMemo(() => {
    return filterRooms(
      rooms,
      searchQuery,
      selectedBuilding,
      selectedCapacity,
      selectedEquipments
    );
  }, [rooms, searchQuery, selectedBuilding, selectedCapacity, selectedEquipments]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetail', { room });
    },
    [navigation]
  );

  const renderRoomItem = useCallback(
    ({ item }: { item: Room }) => {
      return <RoomCard room={item} onPress={handleRoomPress} />;
    },
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Header chính mang phong cách VKU */}
      <View style={styles.header}>
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
      </View>

      {/* Danh sách phòng với FlatList và bộ lọc */}
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
                <View style={styles.realtimePulse} />
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
});
