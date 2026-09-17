export type Building = 'A' | 'B' | 'C' | 'V';

export type CapacityRange = 'all' | '2-5' | '6-10' | '11-15' | '16-20';

export type Equipment =
  | 'Máy chiếu'
  | 'Bảng trắng'
  | 'Máy tính cấu hình cao'
  | 'Điều hòa';

export type RoomStatus = 'available' | 'in_use';

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  image: string;
  description: string;
  status: RoomStatus;
  type: 'Phòng học' | 'Phòng máy' | 'Phòng hội thảo';
}
