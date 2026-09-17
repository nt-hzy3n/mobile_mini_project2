import { TimeSlot } from '../types/booking';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    startTime: '07:30',
    endTime: '09:30',
    label: '07:30 – 09:30',
    durationHours: 2,
  },
  {
    id: 'slot-2',
    startTime: '09:30',
    endTime: '11:30',
    label: '09:30 – 11:30',
    durationHours: 2,
  },
  {
    id: 'slot-3',
    startTime: '13:00',
    endTime: '15:00',
    label: '13:00 – 15:00',
    durationHours: 2,
  },
  {
    id: 'slot-4',
    startTime: '15:00',
    endTime: '17:00',
    label: '15:00 – 17:00',
    durationHours: 2,
  },
];
