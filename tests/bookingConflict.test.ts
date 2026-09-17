import { INITIAL_ROOMS } from '../src/data/rooms';
import { TIME_SLOTS } from '../src/data/timeSlots';
import { filterRooms } from '../src/stores/useRoomStore';
import { Booking } from '../src/types/booking';
import {
  generateBookingCode,
  isSlotBooked,
  refreshBookingsStatus,
  validateBookingConflict,
} from '../src/utils/booking';
import { formatDateToVietnamese, getNext7Days, isSlotEnded } from '../src/utils/date';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('==============================================');
console.log('BẮT ĐẦU KIỂM THỬ HỆ THỐNG ĐẶT PHÒNG HỌC VKU');
console.log('==============================================\n');

// 1. Test Date Utilities
console.log('--- 1. Kiểm thử Date Utilities ---');
const next7Days = getNext7Days();
assert(next7Days.length === 7, 'getNext7Days() phải trả về đúng 7 ngày');
assert(next7Days[0].isToday === true, 'Ngày đầu tiên phải có isToday = true');
assert(
  typeof next7Days[0].dayOfWeek === 'string' && next7Days[0].dayOfWeek.startsWith('Thứ') || next7Days[0].dayOfWeek === 'Chủ Nhật',
  'Thứ trong tuần phải là tiếng Việt chuẩn'
);

const formattedDate = formatDateToVietnamese('2026-09-17');
assert(
  formattedDate.includes('17/09/2026'),
  'formatDateToVietnamese() phải định dạng đúng ngày/tháng/năm'
);

// 2. Test Conflict Prevention Engine
console.log('\n--- 2. Kiểm thử Conflict Prevention Engine (Hệ thống chống xung đột) ---');
const mockExistingBookings: Booking[] = [
  {
    id: 'VKU-A101-1709-TEST',
    roomId: 'room-a101',
    roomName: 'Phòng A101',
    building: 'A',
    floor: 1,
    roomType: 'Phòng học',
    date: '2026-09-17',
    dateDisplay: 'Thứ Năm, 17/09/2026',
    timeSlot: TIME_SLOTS[0], // 07:30 – 09:30
    userId: 'sv-001',
    userName: 'Trần Văn B',
    studentId: '21IT002',
    createdAt: new Date().toISOString(),
    status: 'upcoming',
  },
  {
    id: 'VKU-A101-1709-CANC',
    roomId: 'room-a101',
    roomName: 'Phòng A101',
    building: 'A',
    floor: 1,
    roomType: 'Phòng học',
    date: '2026-09-17',
    dateDisplay: 'Thứ Năm, 17/09/2026',
    timeSlot: TIME_SLOTS[1], // 09:30 – 11:30 (Đã hủy)
    userId: 'sv-002',
    userName: 'Lê Thị C',
    studentId: '21IT003',
    createdAt: new Date().toISOString(),
    status: 'cancelled',
  },
];

// Test 2.1: Trùng phòng + trùng ngày + trùng slot đã có upcoming booking -> BỊ CHẶN
const checkConflictTrue = validateBookingConflict(
  'room-a101',
  '2026-09-17',
  TIME_SLOTS[0].id,
  mockExistingBookings
);
assert(
  checkConflictTrue.hasConflict === true,
  'Slot đã có upcoming booking phải bị chặn xung đột'
);
assert(
  checkConflictTrue.message === 'Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác.',
  'Thông báo lỗi xung đột phải đúng chuẩn yêu cầu tiếng Việt'
);

// Test 2.2: Trùng phòng + trùng ngày nhưng slot KHÁC (chưa ai đặt) -> KHÔNG XUNG ĐỘT
const checkDifferentSlot = validateBookingConflict(
  'room-a101',
  '2026-09-17',
  TIME_SLOTS[2].id, // 13:00 – 15:00
  mockExistingBookings
);
assert(
  checkDifferentSlot.hasConflict === false,
  'Khung giờ khác trong cùng ngày chưa ai đặt phải khả dụng'
);

// Test 2.3: Trùng phòng + trùng slot nhưng NGÀY KHÁC -> KHÔNG XUNG ĐỘT
const checkDifferentDate = validateBookingConflict(
  'room-a101',
  '2026-09-18',
  TIME_SLOTS[0].id,
  mockExistingBookings
);
assert(
  checkDifferentDate.hasConflict === false,
  'Cùng khung giờ nhưng ở ngày khác phải khả dụng'
);

// Test 2.4: Trùng ngày + trùng slot nhưng PHÒNG KHÁC (B101) -> KHÔNG XUNG ĐỘT
const checkDifferentRoom = validateBookingConflict(
  'room-b101',
  '2026-09-17',
  TIME_SLOTS[0].id,
  mockExistingBookings
);
assert(
  checkDifferentRoom.hasConflict === false,
  'Cùng ngày và giờ nhưng phòng khác phải khả dụng'
);

// Test 2.5: Slot trước đó đã bị CANCELLED -> KHÔNG XUNG ĐỘT (cho phép người khác đặt lại)
const checkCancelledSlot = validateBookingConflict(
  'room-a101',
  '2026-09-17',
  TIME_SLOTS[1].id,
  mockExistingBookings
);
assert(
  checkCancelledSlot.hasConflict === false,
  'Khung giờ của booking đã hủy (cancelled) phải được giải phóng cho người khác đặt'
);

// 3. Test Room Filter & Search
console.log('\n--- 3. Kiểm thử Tìm kiếm & Bộ lọc kết hợp ---');
assert(INITIAL_ROOMS.length >= 16, 'Danh sách phòng phải có từ 16 phòng trở lên');

// Test 3.1: Lọc theo Tòa A
const roomsBuildingA = filterRooms(INITIAL_ROOMS, '', 'A', 'all', []);
assert(
  roomsBuildingA.every((r) => r.building === 'A'),
  'Bộ lọc tòa A chỉ trả về các phòng thuộc tòa A'
);

// Test 3.2: Lọc theo Sức chứa 6-10 người
const roomsCap610 = filterRooms(INITIAL_ROOMS, '', 'all', '6-10', []);
assert(
  roomsCap610.every((r) => r.capacity >= 6 && r.capacity <= 10),
  'Bộ lọc sức chứa 6-10 chỉ trả về phòng có capacity từ 6 đến 10'
);

// Test 3.3: Lọc kết hợp Tòa A + Sức chứa 6-10 + Máy chiếu
const combinedRooms = filterRooms(INITIAL_ROOMS, '', 'A', '6-10', ['Máy chiếu']);
assert(
  combinedRooms.every(
    (r) =>
      r.building === 'A' &&
      r.capacity >= 6 &&
      r.capacity <= 10 &&
      r.equipment.includes('Máy chiếu')
  ),
  'Bộ lọc kết hợp Tòa A + Sức chứa 6-10 + Máy chiếu thỏa mãn tất cả điều kiện'
);

// Test 3.4: Tìm kiếm tức thì theo từ khóa "Phòng B"
const searchResults = filterRooms(INITIAL_ROOMS, 'Phòng B', 'all', 'all', []);
assert(
  searchResults.length > 0 && searchResults.every((r) => r.name.includes('B')),
  'Tìm kiếm tức thì theo tên phòng hoạt động chính xác'
);

// 4. Test Booking Code Generator
console.log('\n--- 4. Kiểm thử Sinh mã đặt phòng ---');
const bookingCode = generateBookingCode('Phòng A101', '2026-09-17');
assert(
  bookingCode.startsWith('VKU-PHÒNGA101-1709-'),
  'Mã đặt phòng phải có tiền tố VKU, tên phòng và ngày'
);

console.log('\n==============================================');
console.log('TẤT CẢ CÁC BÀI KIỂM THỬ ĐÃ PASS 100%!');
console.log('==============================================\n');
