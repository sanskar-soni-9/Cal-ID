import type { ContactShareOption, MeetingTypeOption } from "../types";

export const CONTACTS_PAGE_SIZE = 10;

export const MEETING_TYPE_OPTIONS: MeetingTypeOption[] = [
  { id: "1", title: "Discovery Call", duration: 30 },
  { id: "2", title: "Strategy Session", duration: 45 },
  { id: "3", title: "Quick Check-in", duration: 15 },
  { id: "4", title: "Product Demo", duration: 60 },
];

export const MEETING_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export const CONTACT_SHARE_OPTIONS: ContactShareOption[] = [
  { id: "copy", label: "Copy Link", description: "Copy your availability link" },
  { id: "email", label: "Email", description: "Open your mail client with a draft" },
  { id: "whatsapp", label: "WhatsApp", description: "Share in WhatsApp" },
];
