"use client";

import React from "react";
import { DocumentViewer, Jumbotron, RowView } from "@/components";
import { IGetEmployeeEnrollmentRes } from "@/redux/api";

type Props = {
  idCardData: unknown;
  employeeData: IGetEmployeeEnrollmentRes;
};

const IdCardView = ({ idCardData, employeeData }: Props) => {
  const idData = idCardData as { signature: string; passport: string };
  return (
    <div className="ml-auto w-full max-w-[744px] pb-6">
      <Jumbotron headerText="Identity Card Form">
        <div className="flex flex-col gap-[18px] p-[23px]">
          <RowView
            name={"Name"}
            value={employeeData?.employeeBioData?.basicInformation?.fullname}
          />{" "}
          <RowView
            name={"Department"}
            value={employeeData?.employmentDetails?.department}
          />{" "}
          <RowView
            name={"Job Title"}
            value={employeeData?.employmentDetails?.jobTitle}
          />{" "}
          <RowView
            name={"Passport Photograph"}
            value={
              <DocumentViewer name="passport.png" link={idData?.passport} />
            }
          />
          <RowView
            name={"Signature"}
            value={
              <DocumentViewer name="Signature.png" link={idData?.signature} />
            }
          />{" "}
          <RowView
            name={"Staff ID Number"}
            value={
              employeeData?.employeeBioData?.basicInformation?.enrollmentId ??
              "__"
            }
          />
        </div>
      </Jumbotron>
    </div>
  );
};

export default IdCardView;
