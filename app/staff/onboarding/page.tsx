"use client";

import React, { useCallback, useContext, useEffect } from "react";
import {
  Avatar,
  NetworkError,
  notify,
  PageLoader,
  Typography,
} from "@/components";
import { cookieValues } from "@/constants/data";
import { UserContext } from "@/layouts/appLayout";
import { useGetOnboardingTaskQuery } from "@/redux/api";
import { resetState } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { convertToCapitalized } from "@/utils/helpers";
import useAuthAction from "@/utils/useAuthAction";
import { useDispatch } from "react-redux";

import { ProgressCard, TaskCard } from "./components";

const Page = () => {
  const data = useContext(UserContext);
  const dispatch = useDispatch();
  const { logout } = useAuthAction();
  const fullname = `${data?.user?.firstname} ${data?.user?.lastname}`;
  const {
    data: tasks,
    isFetching,
    error,
    refetch,
  } = useGetOnboardingTaskQuery(data?.user?.employeeId as string, {
    skip:
      !data?.user?.employeeId ||
      data?.user?.role !== cookieValues.enrollmentRole,
  });

  const handleRoleCheck = useCallback(() => {
    if (data?.user?.role && data?.user?.role !== cookieValues.enrollmentRole) {
      logout(() => {
        notify.error({
          message: "Error",
          subtitle:
            "Your enrollment is complete now! Please log in to the application again.",
        });
      });
    } else {
      dispatch(resetState());
    }
  }, [data?.user?.role, logout, dispatch]);
  useEffect(() => {
    if (data?.user?.role !== undefined) {
      handleRoleCheck();
    }
  }, [handleRoleCheck, data?.user?.role]);

  if (isFetching) return <PageLoader />;
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
          <Avatar
            size="xl"
            fullname={convertToCapitalized(fullname) ?? ""}
            src={data?.user?.profilePicture}
          />
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
            Welcome to Resource Edge! Begin your onboarding process now.
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
          {tasks?.data?.map((task, index) => (
            <TaskCard
              key={index}
              disabled={!tasks?.data[0].completed && index !== 0}
              {...task}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
