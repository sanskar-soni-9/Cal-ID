"use client";

import { Flex, Text, Metric, BadgeDelta } from "@tremor/react";

import { calculateDeltaType, colors, valueFormatter } from "@calcom/features/insights/lib";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Tooltip } from "@calcom/ui/components/tooltip";

import { WeeklyHeatmap } from "./WeeklyHeatmap";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  previousDateRange?: {
    startDate: string;
    endDate: string;
  };
  isLoading?: boolean;
  tooltipContent?: string;
  heatmapData?: number[];
  weekStart?: string;
}

export function MetricCard({
  title,
  value,
  previousValue,
  previousDateRange,
  isLoading = false,
  tooltipContent,
  heatmapData,
  weekStart,
}: MetricCardProps) {
  const { t } = useLocale();

  const delta =
    previousValue !== undefined
      ? previousValue === 0
        ? value > 0
          ? 100
          : 0
        : ((value - previousValue) / previousValue) * 100
      : undefined;

  const deltaType = delta !== undefined ? calculateDeltaType(delta) : undefined;

  if (isLoading) {
    return (
      <div className="bg-default border-default rounded-lg border p-4">
        <div className="space-y-2">
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
          <div className="bg-muted h-8 w-16 animate-pulse rounded" />
          <div className="bg-muted mt-2 h-3 w-32 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const cardContent = (
    <div className="bg-default border-default rounded-lg border p-4">
      <Text className="text-default font-semibold">{title}</Text>
      <Flex className="items-baseline justify-start space-x-3 truncate">
        <Metric className="text-emphasis">{valueFormatter(value)}</Metric>
      </Flex>
      {delta !== undefined && deltaType && (
        <Flex className="mt-4 justify-start space-x-2">
          <BadgeDelta deltaType={deltaType} />
          <Flex className="justify-start space-x-1 truncate">
            <Text color={colors[deltaType]}>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(0)}%
            </Text>
            {tooltipContent || previousDateRange ? (
              <Tooltip content={tooltipContent || t("from_last_week")}>
                <small className="text-default relative top-px cursor-pointer text-xs">
                  {t("from_last_week")}
                </small>
              </Tooltip>
            ) : (
              <small className="text-default relative top-px text-xs">{t("from_last_week")}</small>
            )}
          </Flex>
        </Flex>
      )}
    </div>
  );

  if (heatmapData) {
    return (
      <Tooltip
        content={<WeeklyHeatmap dayValues={heatmapData} weekStart={weekStart} />}
        side="bottom"
        className="!bg-default !p-0 !shadow-lg">
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
}
