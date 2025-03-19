"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { NetworkError, PageLoader } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useGetRoleClaimsQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";

import { Crumb } from "@/components/breadCrumbs/breadCrumbs";

import { CreateOrEditRole } from "../components";

const Page = ({
  params: { roleId },
}: {
  params: {
    roleId: string;
  };
}) => {
  roleId = decodeURIComponent(roleId);
  const params = useSearchParams();
  const role = params.get("name");
  const { data, isLoading, error, refetch, isFetching } = useGetRoleClaimsQuery(
    {
      role: String(role),
    },
  );
  const breadCrumbs: Crumb[] = [
    {
      path: AuthRouteConfig.USER_MANAGEMENT_ROLES,
      name: "Roles",
    },
    {
      name: "Edit Role",
    },
  ];
  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <CreateOrEditRole
      role={role as string}
      roleId={roleId}
      breadCrumbs={breadCrumbs}
      editData={data?.data}
    />
  );
};

export default Page;
