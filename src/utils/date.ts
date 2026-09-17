export interface DayOption {
  dateString: string;     // YYYY-MM-DD
  dayOfWeek: string;      // Thứ Hai, Thứ Ba...
  shortDate: string;      // DD/MM (e.g. 17/09)
  fullDisplay: string;    // Thứ Ba, 17/09/2026
  isToday: boolean;
}

const VIETNAMESE_DAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

/**
 * Tạo danh sách 7 ngày liên tiếp tính từ ngày hiện tại
 */
export function getNext7Days(): DayOption[] {
  const days: DayOption[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const target = new Date(today);
    target.setDate(today.getDate() + i);

    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');

    const dateString = `${year}-${month}-${day}`;
    const dayOfWeek = VIETNAMESE_DAYS[target.getDay()];
    const shortDate = `${day}/${month}`;
    const fullDisplay = `${dayOfWeek}, ${day}/${month}/${year}`;

    days.push({
      dateString,
      dayOfWeek,
      shortDate,
      fullDisplay,
      isToday: i === 0,
    });
  }

  return days;
}

/**
 * Định dạng chuỗi ngày YYYY-MM-DD sang định dạng tiếng Việt
 */
export function formatDateToVietnamese(dateString: string): string {
  try {
    const [yearStr, monthStr, dayStr] = dateString.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const target = new Date(year, month - 1, day);
    const dayOfWeek = VIETNAMESE_DAYS[target.getDay()];

    return `${dayOfWeek}, ${dayStr}/${monthStr}/${yearStr}`;
  } catch {
    return dateString;
  }
}

/**
 * Kiểm tra xem một thời điểm (ngày + giờ kết thúc) đã qua so với hiện tại chưa
 */
export function isSlotEnded(dateString: string, endTimeStr: string): boolean {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = endTimeStr.split(':').map(Number);

    const slotEndTime = new Date(year, month - 1, day, hours, minutes, 0);
    return slotEndTime.getTime() < Date.now();
  } catch {
    return false;
  }
}
