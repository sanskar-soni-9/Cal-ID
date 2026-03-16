import { cn } from "@calid/features/lib/cn";

interface MeetingStepIndicatorProps {
  step: number;
}

const getStepLabel = (step: number) => {
  if (step === 1) return "Event Type";
  if (step === 2) return "Date & Time";
  if (step === 3) return "Guests";
  return "Confirm";
};

export const MeetingStepIndicator = ({ step }: MeetingStepIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 py-2">
      {[1, 2, 3, 4].map((value) => (
        <div key={value} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
              value <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
            {value}
          </div>
          {value < 4 ? <div className={cn("h-px w-6", value < step ? "bg-primary" : "bg-border")} /> : null}
        </div>
      ))}
      <span className="text-muted-foreground ml-2 text-xs">{getStepLabel(step)}</span>
    </div>
  );
};
