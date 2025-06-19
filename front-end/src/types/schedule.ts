export type EventType = "Consultation" | "Meeting" | "Operation";

export interface CustomEvent {
  id?: string;
  title: string;
  type: EventType;
  room: string;
  start: Date;
  end: Date;
}

export interface RawEvent {
  _id: string;
  title: string;
  type: string;
  room: string;
  start: string;
  end: string;
}
