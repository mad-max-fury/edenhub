"use client";

import { AuthRouteConfig } from "@/constants/routes";

import { CreateOrEditRole } from "../components";

const breadCrumbs = [
  {
    path: AuthRouteConfig.USER_MANAGEMENT_ROLES,
    name: "Roles",
  },
  {
    name: "Create New Role",
  },
];

const Page = () => {
  return <CreateOrEditRole breadCrumbs={breadCrumbs} />;
};

export default Page;
