import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { useRoomStore } from '../stores/useRoomStore';
import { Building, CapacityRange, Equipment } from '../types/room';

const BUILDINGS: { id: 'all' | Building; label: string }[] = [
  { id: 'all', label: 'Tất cả tòa' },
  { id: 'A', label: 'Tòa A' },
  { id: 'B', label: 'Tòa B' },
  { id: 'C', label: 'Tòa C' },
  { id: 'V', label: 'Tòa V' },
];

const CAPACITIES: { id: CapacityRange; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: '2-5', label: '2–5 người' },
  { id: '6-10', label: '6–10 người' },
  { id: '11-15', label: '11–15 người' },
  { id: '16-20', label: '16–20 người' },
];

const EQUIPMENTS: Equipment[] = [
  'Máy chiếu',
  'Bảng trắng',
  'Máy tính cấu hình cao',
  'Điều hòa',
];

export const FilterChips: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedBuilding = useRoomStore((state) => state.selectedBuilding);
  const selectedCapacity = useRoomStore((state) => state.selectedCapacity);
  const selectedEquipments = useRoomStore((state) => state.selectedEquipments);
  const setBuilding = useRoomStore((state) => state.setBuilding);
  const setCapacity = useRoomStore((state) => state.setCapacity);
  const toggleEquipment = useRoomStore((state) => state.toggleEquipment);
  const resetFilters = useRoomStore((state) => state.resetFilters);

  // Tính số lượng bộ lọc đang kích hoạt
  const activeFiltersCount =
    (selectedBuilding !== 'all' ? 1 : 0) +
    (selectedCapacity !== 'all' ? 1 : 0) +
    selectedEquipments.length;

  return (
    <View style={styles.container}>
      {/* Thanh Quick Filter theo Tòa nhà cuộn ngang */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Nút mở rộng đầy đủ bộ lọc */}
        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFiltersCount > 0 ? THEME.colors.primary : THEME.colors.textSecondary}
          />
          <Text
            style={[
              styles.filterButtonText,
              activeFiltersCount > 0 && styles.filterButtonTextActive,
            ]}
          >
            Bộ lọc {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>

        {/* Quick Tòa Nhà chips */}
        {BUILDINGS.map((item) => {
          const isSelected = selectedBuilding === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setBuilding(item.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Nút Xóa bộ lọc nhanh nếu đang có filter */}
        {activeFiltersCount > 0 ? (
          <TouchableOpacity style={styles.resetQuickBtn} onPress={resetFilters} activeOpacity={0.7}>
            <Ionicons name="close-circle-outline" size={16} color={THEME.colors.danger} />
            <Text style={styles.resetQuickText}>Xóa lọc</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      {/* Modal bộ lọc chi tiết (Tòa nhà + Sức chứa + Thiết bị) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ lọc tìm kiếm</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Mục 1: Tòa nhà */}
              <Text style={styles.sectionTitle}>Tòa nhà</Text>
              <View style={styles.chipsWrap}>
                {BUILDINGS.map((item) => {
                  const isSelected = selectedBuilding === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.modalChip, isSelected && styles.modalChipActive]}
                      onPress={() => setBuilding(item.id)}
                    >
                      <Text
                        style={[
                          styles.modalChipText,
                          isSelected && styles.modalChipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Mục 2: Sức chứa */}
              <Text style={styles.sectionTitle}>Sức chứa</Text>
              <View style={styles.chipsWrap}>
                {CAPACITIES.map((cap) => {
                  const isSelected = selectedCapacity === cap.id;
                  return (
                    <TouchableOpacity
                      key={cap.id}
                      style={[styles.modalChip, isSelected && styles.modalChipActive]}
                      onPress={() => setCapacity(cap.id)}
                    >
                      <Text
                        style={[
                          styles.modalChipText,
                          isSelected && styles.modalChipTextActive,
                        ]}
                      >
                        {cap.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Mục 3: Thiết bị */}
              <Text style={styles.sectionTitle}>Thiết bị phòng học</Text>
              <View style={styles.chipsWrap}>
                {EQUIPMENTS.map((eq) => {
                  const isSelected = selectedEquipments.includes(eq);
                  return (
                    <TouchableOpacity
                      key={eq}
                      style={[styles.modalChip, isSelected && styles.modalChipActive]}
                      onPress={() => toggleEquipment(eq)}
                    >
                      <Ionicons
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={16}
                        color={isSelected ? THEME.colors.primary : THEME.colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.modalChipText,
                          isSelected && styles.modalChipTextActive,
                        ]}
                      >
                        {eq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
                activeOpacity={0.7}
              >
                <Text style={styles.resetButtonText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>Áp dụng ({activeFiltersCount})</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    gap: 4,
  },
  filterButtonActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  filterButtonText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipActive: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
  },
  chipText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: THEME.colors.textInverse,
    fontWeight: '600',
  },
  resetQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },
  resetQuickText: {
    fontSize: 13,
    color: THEME.colors.danger,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  modalBody: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSecondary,
  },
  modalChipActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  modalChipText: {
    fontSize: 13,
    color: THEME.colors.text,
    fontWeight: '500',
  },
  modalChipTextActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: THEME.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  applyButton: {
    flex: 2,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textInverse,
  },
});
