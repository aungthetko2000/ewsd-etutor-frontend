export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  notes: string;
  sessionColor?: string;
}

export interface EventMap {
  [dateKey: string]: CalendarEvent[];
}