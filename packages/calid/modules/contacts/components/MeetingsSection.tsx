import { Badge } from "@calid/features/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@calid/features/ui/components/card";

import type { ContactMeeting } from "../types";
import { MeetingCard } from "./MeetingCard";

interface MeetingsSectionProps {
  title: React.ReactNode;
  meetings: ContactMeeting[];
  emptyLabel: string;
  countBadge?: boolean;
}

export const MeetingsSection = ({
  title,
  meetings,
  emptyLabel,
  countBadge = false,
}: MeetingsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {title}
          {countBadge && meetings.length > 0 ? (
            <Badge variant="secondary" size="xs" className="ml-1 text-[10px]">
              {meetings.length}
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">{emptyLabel}</p>
        ) : (
          <div className="space-y-2">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
