import { create } from 'zustand';
import { INITIAL_ROOMS } from '../data/rooms';
import { availabilityService } from '../services/availabilityService';
import { Building, CapacityRange, Equipment, Room, RoomStatus } from '../types/room';

interface RoomState {
  rooms: Room[];
  searchQuery: string;
  selectedBuilding: 'all' | Building;
  selectedCapacity: CapacityRange;
  selectedEquipments: Equipment[];

  // Actions
  setSearchQuery: (query: string) => void;
  setBuilding: (building: 'all' | Building) => void;
  setCapacity: (capacity: CapacityRange) => void;
  toggleEquipment: (equipment: Equipment) => void;
  resetFilters: () => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  initAvailabilityListener: () => () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: INITIAL_ROOMS,
  searchQuery: '',
  selectedBuilding: 'all',
  selectedCapacity: 'all',
  selectedEquipments: [],

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setBuilding: (building) => set({ selectedBuilding: building }),

  setCapacity: (capacity) => set({ selectedCapacity: capacity }),

  toggleEquipment: (equipment: Equipment) => {
    const current = get().selectedEquipments;
    const exists = current.includes(equipment);
    if (exists) {
      set({ selectedEquipments: current.filter((e) => e !== equipment) });
    } else {
      set({ selectedEquipments: [...current, equipment] });
    }
  },

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedBuilding: 'all',
      selectedCapacity: 'all',
      selectedEquipments: [],
    }),

  updateRoomStatus: (roomId: string, status: RoomStatus) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, status } : room
      ),
    }));
  },

  initAvailabilityListener: () => {
    const unsubscribe = availabilityService.subscribe((event) => {
      get().updateRoomStatus(event.roomId, event.status);
    });

    // Bắt đầu mô phỏng cập nhật trạng thái phòng cục bộ
    const allRoomIds = get().rooms.map((r) => r.id);
    availabilityService.startSimulation(allRoomIds, 30000);

    return () => {
      unsubscribe();
      availabilityService.stopSimulation();
    };
  },
}));

/**
 * Selector lọc phòng dựa trên tất cả các điều kiện kết hợp (Memoized bên ngoài hoặc dùng useMemo trong component)
 */
export function filterRooms(
  rooms: Room[],
  searchQuery: string,
  building: 'all' | Building,
  capacity: CapacityRange,
  equipments: Equipment[]
): Room[] {
  const query = searchQuery.trim().toLowerCase();

  return rooms.filter((room) => {
    // 1. Tìm kiếm theo tên phòng, mã phòng, tòa nhà
    if (query) {
      const matchName = room.name.toLowerCase().includes(query);
      const matchId = room.id.toLowerCase().includes(query);
      const matchBuilding = `tòa ${room.building}`.toLowerCase().includes(query) ||
        room.building.toLowerCase() === query;
      const matchType = room.type.toLowerCase().includes(query);

      if (!matchName && !matchId && !matchBuilding && !matchType) {
        return false;
      }
    }

    // 2. Lọc theo tòa nhà
    if (building !== 'all' && room.building !== building) {
      return false;
    }

    // 3. Lọc theo sức chứa
    if (capacity !== 'all') {
      if (capacity === '2-5' && (room.capacity < 2 || room.capacity > 5)) return false;
      if (capacity === '6-10' && (room.capacity < 6 || room.capacity > 10)) return false;
      if (capacity === '11-15' && (room.capacity < 11 || room.capacity > 15)) return false;
      if (capacity === '16-20' && (room.capacity < 16 || room.capacity > 20)) return false;
    }

    // 4. Lọc theo thiết bị (phải có đầy đủ tất cả thiết bị được chọn)
    if (equipments.length > 0) {
      const hasAllEquipments = equipments.every((eq) => room.equipment.includes(eq));
      if (!hasAllEquipments) {
        return false;
      }
    }

    return true;
  });
}
