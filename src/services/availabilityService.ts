import { RoomStatus } from '../types/room';

export interface RoomAvailabilityEvent {
  roomId: string;
  status: RoomStatus;
  timestamp: number;
}

type AvailabilityListener = (event: RoomAvailabilityEvent) => void;

class MockAvailabilityService {
  private listeners: Set<AvailabilityListener> = new Set();
  private timer: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;

  /**
   * Đăng ký nhận sự kiện thay đổi trạng thái phòng
   */
  public subscribe(listener: AvailabilityListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Bắt đầu mô phỏng cập nhật trạng thái phòng cục bộ (mô phỏng WebSocket/Server-Sent Events)
   * Thay đổi trạng thái ngẫu nhiên của một phòng mỗi 45 giây để demo trải nghiệm real-time
   */
  public startSimulation(roomIds: string[], intervalMs: number = 45000): void {
    if (this.isRunning || roomIds.length === 0) return;
    this.isRunning = true;

    this.timer = setInterval(() => {
      if (this.listeners.size === 0) return;

      const randomRoomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const nextStatus: RoomStatus = Math.random() > 0.5 ? 'available' : 'in_use';

      this.emit({
        roomId: randomRoomId,
        status: nextStatus,
        timestamp: Date.now(),
      });
    }, intervalMs);
  }

  /**
   * Dừng mô phỏng
   */
  public stopSimulation(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  /**
   * Kích hoạt thủ công một sự kiện thay đổi trạng thái
   */
  public emitManualUpdate(roomId: string, status: RoomStatus): void {
    this.emit({
      roomId,
      status,
      timestamp: Date.now(),
    });
  }

  private emit(event: RoomAvailabilityEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Lỗi trong availability listener:', err);
      }
    });
  }
}

export const availabilityService = new MockAvailabilityService();
