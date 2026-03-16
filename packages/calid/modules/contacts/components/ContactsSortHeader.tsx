import { cn } from "@calid/features/lib/cn";
import { ArrowUpDown } from "lucide-react";

import type { ContactSortKey } from "../types";

interface ContactsSortHeaderProps {
  label: string;
  field: ContactSortKey;
  activeSortKey: ContactSortKey;
  onSortChange: (key: ContactSortKey) => void;
}

export const ContactsSortHeader = ({
  label,
  field,
  activeSortKey,
  onSortChange,
}: ContactsSortHeaderProps) => {
  return (
    <button
      onClick={() => onSortChange(field)}
      className="hover:text-foreground flex items-center gap-1 transition-colors">
      {label}
      <ArrowUpDown
        className={cn("h-3 w-3", activeSortKey === field ? "text-primary" : "text-muted-foreground/50")}
      />
    </button>
  );
};
