
export interface RecurringSchedule {
  id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlot: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface SchedulingEvent {
  id: string;
  customerId: string;
  date: Date;
  timeSlot: string;
  type: 'pickup' | 'delivery';
  address: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
