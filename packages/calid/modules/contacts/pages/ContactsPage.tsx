"use client";

import { triggerToast } from "@calid/features/ui/components/toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import useMediaQuery from "@calcom/lib/hooks/useMediaQuery";

import { AddEditContactModal } from "../components/AddEditContactModal";
import { NoContactsState, NoContactResultsState } from "../components/ContactsEmptyStates";
import { ContactsMobileList } from "../components/ContactsMobileList";
import { ContactsPagination } from "../components/ContactsPagination";
import { ContactsTable } from "../components/ContactsTable";
import { ContactsToolbar } from "../components/ContactsToolbar";
import { ScheduleMeetingModal } from "../components/ScheduleMeetingModal";
import { ShareAvailabilityModal } from "../components/ShareAvailabilityModal";
import { useContactsListState } from "../hooks/useContactsListState";
import { mockContacts } from "../mock-data/contactsMockData";
import type { Contact } from "../types";

const ContactsPage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    contacts,
    loading,
    search,
    sortKey,
    page,
    totalPages,
    filteredContacts,
    pagedContacts,
    onSearchChange,
    onSortChange,
    setPage,
    saveContact,
  } = useContactsListState(mockContacts);

  const [addOpen, setAddOpen] = useState(false);
  const [shareContact, setShareContact] = useState<Contact | null>(null);
  const [scheduleContact, setScheduleContact] = useState<Contact | null>(null);

  const handleRowClick = (contactId: string) => {
    router.push(`/contacts/${contactId}`);
  };

  const handleSaveContact = (draft: Partial<Contact>) => {
    saveContact(draft);
    triggerToast(draft.id ? "Contact updated" : "Contact created", "success");
  };

  if (!loading && contacts.length === 0) {
    return (
      <>
        <NoContactsState onAddContact={() => setAddOpen(true)} />
        <AddEditContactModal open={addOpen} onOpenChange={setAddOpen} onSave={handleSaveContact} />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <ContactsToolbar
        isMobile={isMobile}
        search={search}
        onSearchChange={onSearchChange}
        onAddContact={() => setAddOpen(true)}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : null}

      {!loading && filteredContacts.length === 0 && contacts.length > 0 ? <NoContactResultsState /> : null}

      {!loading && filteredContacts.length > 0 && !isMobile ? (
        <ContactsTable
          contacts={pagedContacts}
          sortKey={sortKey}
          onSortChange={onSortChange}
          onRowClick={handleRowClick}
          onShare={setShareContact}
          onSchedule={setScheduleContact}
        />
      ) : null}

      {!loading && filteredContacts.length > 0 && isMobile ? (
        <ContactsMobileList
          contacts={pagedContacts}
          onRowClick={handleRowClick}
          onShare={setShareContact}
          onSchedule={setScheduleContact}
        />
      ) : null}

      {!loading ? (
        <ContactsPagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredContacts.length}
          onPageChange={setPage}
        />
      ) : null}

      <AddEditContactModal open={addOpen} onOpenChange={setAddOpen} onSave={handleSaveContact} />
      <ShareAvailabilityModal
        open={Boolean(shareContact)}
        onOpenChange={(open) => {
          if (!open) {
            setShareContact(null);
          }
        }}
        contact={shareContact}
      />
      <ScheduleMeetingModal
        open={Boolean(scheduleContact)}
        onOpenChange={(open) => {
          if (!open) {
            setScheduleContact(null);
          }
        }}
        contact={scheduleContact}
      />
    </div>
  );
};

export default ContactsPage;
