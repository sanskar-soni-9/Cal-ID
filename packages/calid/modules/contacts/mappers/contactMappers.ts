import type { Contact } from "../types";
import { getContactInitials } from "../utils/contactUtils";

export const createContactFromDraft = (draft: Partial<Contact>): Contact => {
  const name = draft.name?.trim() ?? "";

  return {
    id: `${Date.now()}`,
    name,
    email: draft.email?.trim() ?? "",
    phone: draft.phone?.trim() ?? "",
    notes: draft.notes?.trim() ?? "",
    avatar: getContactInitials(name),
    createdAt: new Date(),
    lastMeeting: null,
  };
};

export const mergeContactDraft = (contact: Contact, draft: Partial<Contact>): Contact => {
  const mergedName = draft.name?.trim() ?? contact.name;

  return {
    ...contact,
    ...draft,
    name: mergedName,
    email: draft.email?.trim() ?? contact.email,
    phone: draft.phone?.trim() ?? contact.phone,
    notes: draft.notes?.trim() ?? contact.notes,
    avatar: draft.avatar ?? getContactInitials(mergedName),
  };
};
