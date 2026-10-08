export type EventCategory = 'exam' | 'vacation' | 'festival' | 'holiday' | 'regular';

export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: EventCategory;
  content: string;
  tip?: string;
  deduct?: string;
  gradeStr: string;
  ONE_GRADE_EVENT_YN?: string;
  TW_GRADE_EVENT_YN?: string;
  THREE_GRADE_EVENT_YN?: string;
  isHighlight?: boolean;
  isNeis?: boolean;
}

export interface SchoolInfo {
  officeCode: string;
  officeName: string;
  schoolCode: string;
  schoolName: string;
  address?: string;
}

export interface UserProfile {
  id: string | number;
  login: string;
  name: string;
  avatar_url: string;
  bio?: string;
  public_repos?: number;
  followers?: number;
  grade?: string;
  classNum?: string;
  dept?: string;
  connectedAt?: string;
}

export interface StudentProfile {
  grade: string;
  classNum: string;
  dept: string;
  updatedAt: string;
}

export interface CustomDday {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
}

export interface BookmarkedEvent {
  id?: string;
  title: string;
  date: string;
  category: EventCategory;
}

export interface NotificationConfig {
  enabled: boolean;
  time: string; // '08:00'
  lastNotifiedDate: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
