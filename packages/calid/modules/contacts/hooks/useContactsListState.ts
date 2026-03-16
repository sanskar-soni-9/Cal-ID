import { useMemo, useState } from "react";

import { CONTACTS_PAGE_SIZE } from "../constants";
import { createContactFromDraft, mergeContactDraft } from "../mappers/contactMappers";
import type { Contact, ContactSortDirection, ContactSortKey } from "../types";
import { filterAndSortContacts, paginateContacts } from "../utils/contactUtils";

export const useContactsListState = (initialContacts: Contact[]) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<ContactSortKey>("name");
  const [sortDirection, setSortDirection] = useState<ContactSortDirection>("asc");
  const [page, setPage] = useState(1);
  const [loading] = useState(false);

  const filteredContacts = useMemo(
    () => filterAndSortContacts(contacts, search, sortKey, sortDirection),
    [contacts, search, sortKey, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / CONTACTS_PAGE_SIZE));

  const pagedContacts = useMemo(
    () => paginateContacts(filteredContacts, page, CONTACTS_PAGE_SIZE),
    [filteredContacts, page]
  );

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onSortChange = (nextSortKey: ContactSortKey) => {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextSortKey);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const saveContact = (draft: Partial<Contact>) => {
    if (draft.id) {
      setContacts((current) =>
        current.map((contact) => (contact.id === draft.id ? mergeContactDraft(contact, draft) : contact))
      );
      return;
    }

    const newContact = createContactFromDraft(draft);
    setContacts((current) => [newContact, ...current]);
    setPage(1);
  };

  return {
    contacts,
    loading,
    search,
    sortKey,
    sortDirection,
    page,
    totalPages,
    filteredContacts,
    pagedContacts,
    onSearchChange,
    onSortChange,
    setPage,
    saveContact,
  };
};
