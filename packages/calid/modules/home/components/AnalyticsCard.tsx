"use client";

import { useMemo } from "react";

import dayjs from "@calcom/dayjs";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { weekStartNum } from "@calcom/lib/weekstart";
import { trpc } from "@calcom/trpc";

import { MetricCard } from "../utils/MetricCard";

interface AnalyticsCardProps {
  weekStart?: string;
}

export function AnalyticsCard({ weekStart = "Monday" }: AnalyticsCardProps) {
  const { t } = useLocale();

  const weekStartIndex = weekStartNum(weekStart);

  const thisWeekStart = useMemo(() => {
    const today = dayjs();
    const currentDay = today.day();
    const daysFromWeekStart = (currentDay - weekStartIndex + 7) % 7;
    return today.subtract(daysFromWeekStart, "day").startOf("day").toISOString();
  }, [weekStartIndex]);

  const thisWeekEnd = useMemo(() => {
    return dayjs(thisWeekStart).add(6, "day").endOf("day").toISOString();
  }, [thisWeekStart]);

  const lastWeekStart = useMemo(() => {
    return dayjs(thisWeekStart).subtract(7, "day").toISOString();
  }, [thisWeekStart]);

  const lastWeekEnd = useMemo(() => {
    return dayjs(lastWeekStart).add(6, "day").endOf("day").toISOString();
  }, [lastWeekStart]);

  const { data: thisWeekUpcoming, isLoading: isLoadingThisWeekUpcoming } = trpc.viewer.bookings.get.useQuery(
    {
      limit: 100,
      offset: 0,
      filters: {
        status: "upcoming",
        afterStartDate: thisWeekStart,
      },
    },
    {
      staleTime: 30000,
    }
  );

  const { data: thisWeekPast, isLoading: isLoadingThisWeekPast } = trpc.viewer.bookings.get.useQuery(
    {
      limit: 100,
      offset: 0,
      filters: {
        status: "past",
        afterStartDate: thisWeekStart,
      },
    },
    {
      staleTime: 30000,
    }
  );

  const { data: lastWeekUpcoming, isLoading: isLoadingLastWeekUpcoming } = trpc.viewer.bookings.get.useQuery(
    {
      limit: 100,
      offset: 0,
      filters: {
        status: "upcoming",
        afterStartDate: lastWeekStart,
      },
    },
    {
      staleTime: 30000,
    }
  );

  const { data: lastWeekPast, isLoading: isLoadingLastWeekPast } = trpc.viewer.bookings.get.useQuery(
    {
      limit: 100,
      offset: 0,
      filters: {
        status: "past",
        afterStartDate: lastWeekStart,
      },
    },
    {
      staleTime: 30000,
    }
  );

  const { bookingsThisWeek, bookingsByDay } = useMemo(() => {
    const allBookings = [...(thisWeekUpcoming?.bookings || []), ...(thisWeekPast?.bookings || [])];
    const filteredBookings = allBookings.filter((booking) => {
      const startTime = dayjs(booking.startTime);
      return (
        startTime.isAfter(dayjs(thisWeekStart).subtract(1, "ms")) &&
        startTime.isBefore(dayjs(thisWeekEnd).add(1, "ms"))
      );
    });

    const dayValues = [0, 0, 0, 0, 0, 0, 0];
    filteredBookings.forEach((booking) => {
      const bookingDay = dayjs(booking.startTime).day(); // 0 = Sunday, 6 = Saturday
      const weekStartRelativeIndex = (bookingDay - weekStartIndex + 7) % 7;
      dayValues[weekStartRelativeIndex] += 1;
    });

    return {
      bookingsThisWeek: filteredBookings.length,
      bookingsByDay: dayValues,
    };
  }, [thisWeekUpcoming, thisWeekPast, thisWeekStart, thisWeekEnd, weekStartIndex]);

  const bookingsLastWeek = useMemo(() => {
    const allBookings = [...(lastWeekUpcoming?.bookings || []), ...(lastWeekPast?.bookings || [])];
    return allBookings.filter((booking) => {
      const startTime = dayjs(booking.startTime);
      return (
        startTime.isAfter(dayjs(lastWeekStart).subtract(1, "ms")) &&
        startTime.isBefore(dayjs(lastWeekEnd).add(1, "ms"))
      );
    }).length;
  }, [lastWeekUpcoming, lastWeekPast, lastWeekStart, lastWeekEnd]);

  const isLoading =
    isLoadingThisWeekUpcoming || isLoadingThisWeekPast || isLoadingLastWeekUpcoming || isLoadingLastWeekPast;

  const tooltipContent = useMemo(() => {
    return (
      t("from_to_date_period", {
        startDate: dayjs(lastWeekStart).format("D-MMM-YY"),
        endDate: dayjs(lastWeekEnd).format("D-MMM-YY"),
      }) || `from ${dayjs(lastWeekStart).format("D-MMM-YY")} to ${dayjs(lastWeekEnd).format("D-MMM-YY")}`
    );
  }, [lastWeekStart, lastWeekEnd, t]);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title={t("bookings_this_week")}
          value={bookingsThisWeek}
          previousValue={bookingsLastWeek}
          previousDateRange={{
            startDate: dayjs(lastWeekStart).format("D-MMM-YY"),
            endDate: dayjs(lastWeekEnd).format("D-MMM-YY"),
          }}
          isLoading={isLoading}
          tooltipContent={tooltipContent}
          heatmapData={bookingsByDay}
          weekStart={weekStart}
        />
      </div>
    </div>
  );
}
