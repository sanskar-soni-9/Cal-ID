"use client";

import { Button } from "@calid/features/ui/components/button";
import { triggerToast } from "@calid/features/ui/components/toast";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import useMediaQuery from "@calcom/lib/hooks/useMediaQuery";

import { AddEditContactModal } from "../components/AddEditContactModal";
import { ContactNotesCard } from "../components/ContactNotesCard";
import { ContactProfileCard } from "../components/ContactProfileCard";
import { MeetingsSection } from "../components/MeetingsSection";
import { ScheduleMeetingModal } from "../components/ScheduleMeetingModal";
import { ShareAvailabilityModal } from "../components/ShareAvailabilityModal";
import { mockContacts, mockMeetings } from "../mock-data/contactsMockData";
import type { Contact } from "../types";

interface ContactDetailPageProps {
  contactId: string;
}

const ContactDetailPage = ({ contactId }: ContactDetailPageProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const contact = mockContacts.find((item) => item.id === contactId);

  const meetings = useMemo(
    () =>
      mockMeetings
        .filter((meeting) => meeting.contactId === contactId)
        .sort((first, second) => second.date.getTime() - first.date.getTime()),
    [contactId]
  );

  const upcomingMeetings = meetings.filter((meeting) => meeting.status === "upcoming");
  const pastMeetings = meetings.filter((meeting) => meeting.status !== "upcoming");

  const [notes, setNotes] = useState(contact?.notes ?? "");
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="mb-1 text-lg font-semibold">Contact not found</h3>
        <p className="text-muted-foreground mb-4 text-sm">This contact may have been removed.</p>
        <Button color="secondary" onClick={() => router.push("/contacts")}>
          <ArrowLeft className="h-4 w-4" /> Back to Contacts
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    triggerToast(`${contact.name} has been removed.`, "success");
    router.push("/contacts");
  };

  const handleSaveContact = (_draft: Partial<Contact>) => {
    triggerToast("Contact updated", "success");
    setEditOpen(false);
  };

  const handleSaveNotes = () => {
    triggerToast("Notes saved", "success");
  };

  return (
    <div className="space-y-6">
      <Button
        color="minimal"
        size="sm"
        onClick={() => router.push("/contacts")}
        className="text-muted-foreground -ml-2">
        <ArrowLeft className="h-4 w-4" /> Contacts
      </Button>

      <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        <div className="space-y-6">
          <ContactProfileCard
            contact={contact}
            onEdit={() => setEditOpen(true)}
            onShare={() => setShareOpen(true)}
            onSchedule={() => setScheduleOpen(true)}
            onDelete={handleDelete}
          />

          <ContactNotesCard
            notes={notes}
            onNotesChange={setNotes}
            hasChanges={notes !== contact.notes}
            onSave={handleSaveNotes}
          />
        </div>

        <div className={`space-y-6 ${isMobile ? "" : "col-span-2"}`}>
          <MeetingsSection
            title={
              <>
                <CalendarDays className="h-4 w-4" /> Upcoming Meetings
              </>
            }
            meetings={upcomingMeetings}
            emptyLabel="No upcoming meetings"
            countBadge
          />

          <MeetingsSection
            title={
              <>
                <Clock className="h-4 w-4" /> Meeting History
              </>
            }
            meetings={pastMeetings}
            emptyLabel="No past meetings"
          />
        </div>
      </div>

      <AddEditContactModal
        open={editOpen}
        onOpenChange={setEditOpen}
        contact={contact}
        onSave={handleSaveContact}
      />
      <ShareAvailabilityModal open={shareOpen} onOpenChange={setShareOpen} contact={contact} />
      <ScheduleMeetingModal open={scheduleOpen} onOpenChange={setScheduleOpen} contact={contact} />
    </div>
  );
};

export default ContactDetailPage;
