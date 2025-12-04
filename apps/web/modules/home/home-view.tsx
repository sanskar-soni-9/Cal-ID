"use client";

import { AnalyticsCard } from "@calid/features/modules/home/components/AnalyticsCard";
import { GettingStarted } from "@calid/features/modules/home/components/GettingStartedCard";
import { Meetings } from "@calid/features/modules/home/components/MeetingsCard";
import { MoreFeatures } from "@calid/features/modules/home/components/MoreFeaturesCard";
import { MostUsedApps } from "@calid/features/modules/home/components/MostUsedAppsCard";
import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";
import { useMemo } from "react";

import Shell from "@calcom/features/shell/Shell";
import useMeQuery from "@calcom/trpc/react/hooks/useMeQuery";

export default function HomePage() {
  const { data: user, isLoading } = useMeQuery();
  const userMetadata = user?.metadata as any;
  const username = user?.username;

  const isOnboardingComplete = useMemo(() => {
    if (!userMetadata?.gettingStartedActions) return false;
    const actions = userMetadata.gettingStartedActions;
    const requiredActions = [
      "viewPublicPage",
      "updateUsername",
      "addOrEditEvents",
      "setAvailability",
      "shareYourCalID",
    ];
    return requiredActions.every((action) => actions[action] === true);
  }, [userMetadata]);

  return (
    <Shell withoutMain={true}>
      <ShellMainAppDir heading="Home" subtitle="Your central hub for scheduling and managing meetings">
        <div className="flex w-full flex-col items-stretch gap-4 px-2 py-4 lg:flex-row lg:px-0">
          <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-[4]">
            {isOnboardingComplete ? (
              <div className="border-default animate-fade-in-up flex w-full flex-col items-center overflow-hidden rounded-md border px-4 py-6 sm:py-8">
                <div className="mb-4 flex w-full items-center justify-center sm:mb-8">
                  <h2 className="text-default text-center text-lg font-bold">Analytics</h2>
                </div>
                <AnalyticsCard weekStart={user?.weekStart} />
              </div>
            ) : (
              <GettingStarted userMetadata={userMetadata as any} isLoading={isLoading} username={username} />
            )}
            <MoreFeatures />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-[2]">
            <Meetings />
            <MostUsedApps />
          </div>
        </div>
      </ShellMainAppDir>
    </Shell>
  );
}
