"use client";

import { cn } from "@calid/features/lib/cn";
import { Button } from "@calid/features/ui/components/button";
import { Calendar } from "@calid/features/ui/components/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@calid/features/ui/components/dialog";
import { Input } from "@calid/features/ui/components/input/input";
import { Label } from "@calid/features/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@calid/features/ui/components/popover";
import { triggerToast } from "@calid/features/ui/components/toast";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, Check, Clock, Users, Video } from "lucide-react";
import { useState } from "react";

import { MEETING_TIME_SLOTS, MEETING_TYPE_OPTIONS } from "../constants";
import type { Contact } from "../types";
import { MeetingStepIndicator } from "./MeetingStepIndicator";

interface ScheduleMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export const ScheduleMeetingModal = ({ open, onOpenChange, contact }: ScheduleMeetingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [additionalGuests, setAdditionalGuests] = useState("");

  const resetAndClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep(1);
      setSelectedEvent("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setAdditionalGuests("");
    }

    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    triggerToast(
      `Meeting with ${contact?.name || "contact"} confirmed for ${
        selectedDate ? format(selectedDate, "PPP") : "selected date"
      } at ${selectedTime}.`,
      "success"
    );

    resetAndClose(false);
  };

  const selectedEventInfo = MEETING_TYPE_OPTIONS.find((eventType) => eventType.id === selectedEvent);

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent size="md" enableOverflow className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Video className="h-4 w-4" />
            Schedule Meeting {contact ? `with ${contact.name}` : ""}
          </DialogTitle>
        </DialogHeader>

        <MeetingStepIndicator step={step} />

        {step === 1 ? (
          <div className="space-y-2 pt-2">
            <Label>Select Event Type</Label>
            <div className="space-y-2">
              {MEETING_TYPE_OPTIONS.map((eventType) => (
                <button
                  key={eventType.id}
                  onClick={() => setSelectedEvent(eventType.id)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                    selectedEvent === eventType.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}>
                  <div className="text-sm font-medium">{eventType.title}</div>
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" /> {eventType.duration} min
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button disabled={!selectedEvent} onClick={() => setStep(2)}>
                Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    color="secondary"
                    className={cn(
                      "w-full justify-start text-left",
                      !selectedDate && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="bg-default w-auto border p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedDate ? (
              <div className="space-y-1.5">
                <Label>Select Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {MEETING_TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-xs transition-colors",
                        selectedTime === time
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:bg-muted/50"
                      )}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-between pt-2">
              <Button color="secondary" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
              </Button>
              <Button disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)}>
                Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 border-border rounded-lg border p-3">
              <div className="text-sm font-medium">{contact?.name}</div>
              <div className="text-muted-foreground text-xs">{contact?.email}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Additional Guests
              </Label>
              <Input
                value={additionalGuests}
                onChange={(event) => setAdditionalGuests(event.target.value)}
                placeholder="guest1@email.com, guest2@email.com"
              />
              <p className="text-muted-foreground text-xs">Separate multiple emails with commas</p>
            </div>
            <div className="flex justify-between pt-2">
              <Button color="secondary" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4 pt-2">
            <div className="border-border space-y-3 rounded-lg border p-4">
              <h4 className="text-sm font-semibold">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{selectedEventInfo?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedDate ? format(selectedDate, "PPP") : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{selectedEventInfo?.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium">{contact?.name}</span>
                </div>
                {additionalGuests ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="text-right text-xs font-medium">{additionalGuests}</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between">
              <Button color="secondary" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-1 h-3.5 w-3.5" /> Confirm Booking
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
