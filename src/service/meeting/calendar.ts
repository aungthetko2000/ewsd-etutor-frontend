export type EventColor =
  | "indigo"
  | "violet"
  | "sky"
  | "emerald"
  | "rose";

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  notes: string;
  color?: EventColor;
}

export interface EventMap {
  [dateKey: string]: CalendarEvent[];
}