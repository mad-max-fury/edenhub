"use client";

import React from "react";
import { Avatar, NetworkError, PageLoader, Typography } from "@/components";
import { LOCAL_STORAGE_VALUES } from "@/constants/data";
import {
  IVerifyUserResponse,
  useGetOnboardingTaskForOldUserQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { convertToCapitalized } from "@/utils/helpers";

import { ProgressCard } from "../staff/onboarding/components";
import { TaskCard } from "./components/TaskCard";

const Page = () => {
  const user = React.useMemo(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_VALUES.RE_OLD_USER);
      return storedUser
        ? (JSON.parse(storedUser) as IVerifyUserResponse)
        : null;
    } catch (error) {
      return null;
    }
  }, []);

  const fullname = user?.fullName;
  const {
    data: tasks,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOnboardingTaskForOldUserQuery(user?.employeeId as string, {
    skip: !user?.employeeId,
  });

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="col-span-12 sm:col-span-9 lg:col-span-10">
          <Avatar size="xl" fullname={convertToCapitalized(fullname) ?? ""} />
          <Typography
            variant="h-xl"
            fontWeight="medium"
            className="mt-2 text-N900 sm:mt-4"
          >
            {`Hello, ${fullname}`}
          </Typography>
          <Typography
            variant="c-m"
            className="mb-6 mt-1 text-N500 sm:mb-0 sm:mt-4"
          >
            {` We’ve got a list of tasks to help get you up and running with Resource Edge. Once you’re done, you’ll have the ability to set up additional features within the app at your leisure.`}
          </Typography>
        </div>
        <div className="col-span-12 sm:col-span-3 lg:col-span-2">
          {tasks?.data && <ProgressCard tasks={tasks?.data} />}
        </div>
      </div>
      <div>
        <Typography variant="h-l" fontWeight="bold" className="mb-4 text-N800">
          Onboarding Tasks
        </Typography>
        <div className="grid grid-cols-1 gap-6 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(tasks?.data ?? [])
            .slice()
            .reverse()
            .map((task, index, array) => {
              return (
                <TaskCard
                  key={index}
                  disabled={!array[0].completed && index !== 0}
                  {...task}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Page;
