export type ContactSortKey = "name" | "lastMeeting" | "createdAt";

export type ContactSortDirection = "asc" | "desc";

export type MeetingStatus = "upcoming" | "completed" | "cancelled";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  avatar: string;
  createdAt: Date;
  lastMeeting: Date | null;
}

export interface ContactMeeting {
  id: string;
  contactId: string;
  title: string;
  date: Date;
  duration: number;
  status: MeetingStatus;
  notes?: string;
  meetingLink?: string;
}

export interface MeetingTypeOption {
  id: string;
  title: string;
  duration: number;
}

export interface ContactShareOption {
  id: string;
  label: string;
  description: string;
}
