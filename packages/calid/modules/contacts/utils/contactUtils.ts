import type { Contact, ContactSortDirection, ContactSortKey } from "../types";

export const getContactInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const filterAndSortContacts = (
  contacts: Contact[],
  search: string,
  sortKey: ContactSortKey,
  sortDirection: ContactSortDirection
) => {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.toLowerCase().includes(query)
      )
    : [...contacts];

  filtered.sort((a, b) => {
    let comparison = 0;

    if (sortKey === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortKey === "lastMeeting") {
      comparison = (a.lastMeeting?.getTime() ?? 0) - (b.lastMeeting?.getTime() ?? 0);
    } else {
      comparison = a.createdAt.getTime() - b.createdAt.getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return filtered;
};

export const paginateContacts = (contacts: Contact[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  return contacts.slice(start, start + pageSize);
};

export const createAvailabilityShareLink = (contact: Contact) => {
  const slug = contact.name.trim().toLowerCase().replace(/\s+/g, "-");

  if (typeof window === "undefined") {
    return `https://cal.id/${slug}`;
  }

  return `${window.location.origin}/${slug}`;
};
