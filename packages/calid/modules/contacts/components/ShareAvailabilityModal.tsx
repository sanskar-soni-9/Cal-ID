"use client";

import { Button } from "@calid/features/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@calid/features/ui/components/dialog";
import { Input } from "@calid/features/ui/components/input/input";
import { TextArea } from "@calid/features/ui/components/input/text-area";
import { Label } from "@calid/features/ui/components/label";
import { triggerToast } from "@calid/features/ui/components/toast";
import { Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

import { CONTACT_SHARE_OPTIONS } from "../constants";
import type { Contact } from "../types";
import { createAvailabilityShareLink } from "../utils/contactUtils";

interface ShareAvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export const ShareAvailabilityModal = ({ open, onOpenChange, contact }: ShareAvailabilityModalProps) => {
  const [message, setMessage] = useState(
    "Hi! Here is my availability link so you can pick a time that works for you."
  );

  const shareLink = useMemo(() => {
    if (!contact) {
      return "";
    }

    return createAvailabilityShareLink(contact);
  }, [contact]);

  const copyLink = async () => {
    if (!shareLink) {
      return;
    }

    await navigator.clipboard.writeText(shareLink);
    triggerToast("Availability link copied", "success");
  };

  const shareViaEmail = () => {
    if (!contact) {
      return;
    }

    const subject = `Availability from ${contact.name}`;
    const body = `${message}\n\n${shareLink}`;
    window.open(
      `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
    triggerToast("Email draft opened", "success");
  };

  const shareViaWhatsApp = () => {
    const payload = `${message} ${shareLink}`.trim();
    window.open(`https://wa.me/?text=${encodeURIComponent(payload)}`, "_blank", "noopener,noreferrer");
    triggerToast("Share window opened", "success");
  };

  const handleQuickShare = (shareId: string) => {
    if (shareId === "copy") {
      void copyLink();
      return;
    }

    if (shareId === "email") {
      shareViaEmail();
      return;
    }

    shareViaWhatsApp();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" enableOverflow className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Share2 className="h-4 w-4" />
            Share Availability {contact ? `with ${contact.name}` : ""}
          </DialogTitle>
          <DialogDescription>Send your availability link using your preferred channel.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="availability-link">Availability Link</Label>
            <div className="flex gap-2">
              <Input id="availability-link" value={shareLink} readOnly />
              <Button color="secondary" onClick={copyLink} className="shrink-0">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="share-message">Message</Label>
            <TextArea
              id="share-message"
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {CONTACT_SHARE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleQuickShare(option.id)}
                className="border-border hover:bg-muted/50 rounded-lg border p-3 text-left transition-colors">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {option.id === "copy" ? <Copy className="h-3.5 w-3.5" /> : null}
                  {option.id === "email" ? <Mail className="h-3.5 w-3.5" /> : null}
                  {option.id === "whatsapp" ? <MessageCircle className="h-3.5 w-3.5" /> : null}
                  {option.label}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button color="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
