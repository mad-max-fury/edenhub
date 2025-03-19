"use client";

import React from "react";
import Link from "next/link";
import { Button, PageHeader } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { resetState } from "@/redux/api/employee/enrollmentForm.slice";
import { useDispatch } from "react-redux";

import { EnrollmentTable } from "./components";

const Page = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <PageHeader
        title="Enrollment List"
        buttonGroup={
          <Link
            href={`${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT_CREATE}`}
            onClick={() => dispatch(resetState())}
          >
            <Button>Enroll</Button>
          </Link>
        }
      />
      <div className="mt-12">
        <EnrollmentTable />
      </div>
    </div>
  );
};

export default Page;
