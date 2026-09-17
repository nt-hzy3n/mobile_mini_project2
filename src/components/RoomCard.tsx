import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../constants/theme';
import { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(({ room, onPress }) => {
  const isAvailable = room.status === 'available';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(room)}
      activeOpacity={0.88}
    >
      {/* Hình ảnh phòng */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
        {/* Badge Loại phòng */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{room.type}</Text>
        </View>

        {/* Badge Trạng thái: Đang trống / Đang được sử dụng */}
        <View
          style={[
            styles.statusBadge,
            isAvailable ? styles.statusAvailable : styles.statusInUse,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isAvailable ? THEME.colors.success : THEME.colors.danger },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isAvailable ? THEME.colors.success : THEME.colors.danger },
            ]}
          >
            {isAvailable ? 'Đang trống' : 'Đang được sử dụng'}
          </Text>
        </View>
      </View>

      {/* Thông tin phòng */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.roomName}>{room.name}</Text>
          <View style={styles.buildingTag}>
            <Text style={styles.buildingTagText}>
              Tòa {room.building} • Tầng {room.floor}
            </Text>
          </View>
        </View>

        {/* Sức chứa */}
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color={THEME.colors.textSecondary} />
          <Text style={styles.capacityText}>Sức chứa: {room.capacity} người</Text>
        </View>

        {/* Danh sách thiết bị */}
        <View style={styles.equipmentContainer}>
          <Text style={styles.equipmentTitle}>Thiết bị:</Text>
          <View style={styles.equipmentWrap}>
            {room.equipment.map((eq, index) => (
              <View key={index} style={styles.equipmentChip}>
                <Text style={styles.equipmentChipText}>{eq}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

RoomCard.displayName = 'RoomCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.md,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 45, 90, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  typeText: {
    color: THEME.colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  statusAvailable: {
    backgroundColor: THEME.colors.successLight,
  },
  statusInUse: {
    backgroundColor: THEME.colors.dangerLight,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  buildingTag: {
    backgroundColor: THEME.colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  buildingTagText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  capacityText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  equipmentContainer: {
    marginTop: 4,
  },
  equipmentTitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginBottom: 4,
  },
  equipmentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  equipmentChip: {
    backgroundColor: THEME.colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  equipmentChipText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
});
