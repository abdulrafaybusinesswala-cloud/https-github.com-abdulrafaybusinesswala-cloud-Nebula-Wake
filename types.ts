export interface Alarm {
  id: string;
  time: string; // Format "HH:mm" (24h)
  label: string;
  isActive: boolean;
  days: number[]; // 0 = Sunday, 1 = Monday, etc. Empty = Once
  createdAt: number;
}

export interface MorningBriefingData {
  greeting: string;
  quote: string;
  fact: string;
}

export enum AppState {
  IDLE,
  RINGING,
  SNOOZED,
}
