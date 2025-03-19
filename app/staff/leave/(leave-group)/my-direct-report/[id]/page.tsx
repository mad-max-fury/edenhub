"use client";

import React from "react";
import { useParams } from "next/navigation";

import { ViewEmployeeLeave } from "../../components";

const Page = () => {
  const params = useParams();
  return (
    <div>
      <ViewEmployeeLeave id={String(params?.id)} staff="supervisor" />
    </div>
  );
};

export default Page;
