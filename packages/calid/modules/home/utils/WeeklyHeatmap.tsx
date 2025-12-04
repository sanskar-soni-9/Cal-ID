"use client";

import { useMemo } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { weekdayNames } from "@calcom/lib/weekday";
import { weekStartNum } from "@calcom/lib/weekstart";

interface WeeklyHeatmapProps {
  dayValues: number[];
  weekStart?: string;
}

export function WeeklyHeatmap({ dayValues, weekStart = "Monday" }: WeeklyHeatmapProps) {
  const { i18n } = useLocale();
  const weekStartIndex = weekStartNum(weekStart);

  const dayNames = weekdayNames(i18n.language, weekStartIndex, "short");

  const maxCount = useMemo(() => {
    return Math.max(...dayValues, 1);
  }, [dayValues]);

  const getBackgroundColor = (count: number) => {
    if (count === 0) {
      return "bg-emphasis text-default";
    }

    const intensity = count / maxCount;

    if (intensity <= 0.25) {
      return "bg-blue-100 text-black";
    } else if (intensity <= 0.5) {
      return "bg-blue-200 text-black";
    } else if (intensity <= 0.75) {
      return "bg-blue-300 text-black";
    } else {
      return "bg-blue-400 text-black";
    }
  };

  return (
    <div className="bg-default flex flex-col gap-2 rounded-md p-2">
      <div className="flex gap-2">
        {dayNames.map((day, index) => (
          <div key={`${day}-${index}`} className="flex flex-col items-center gap-1.5">
            <span className="text-default text-xs font-medium">{day}</span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${getBackgroundColor(
                dayValues[index]
              )}`}>
              {dayValues[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
