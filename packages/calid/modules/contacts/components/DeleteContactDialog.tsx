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
import { Trash2 } from "lucide-react";

interface DeleteContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName: string;
  onConfirm: () => void;
}

export const DeleteContactDialog = ({
  open,
  onOpenChange,
  contactName,
  onConfirm,
}: DeleteContactDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete {contactName}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All meeting history will be preserved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button color="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button color="destructive" onClick={onConfirm}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
