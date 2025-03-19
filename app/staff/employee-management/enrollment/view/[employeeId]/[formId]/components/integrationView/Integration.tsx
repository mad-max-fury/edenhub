"use client";

import React from "react";
import { Jumbotron, RowView } from "@/components";
import { IGetEmployeeEnrollmentRes } from "@/redux/api";

import AttentionBanner from "@/components/attentionBanner/AttentionBanner";
import { shortDate } from "@/utils/helpers";

interface IIntegrationData {
  formId: number;
  title: string;
  description: string;
  introducedToEveryone: boolean;
  dateIntroducedToEveryone: string;
  givenEmplyeeDataForm: boolean;
  dateGivenEmplyeeDataForm: string;
  givenHmoRefereeAndGuarantorForm: boolean;
  dateGivenHmoRefereeAndGuarantorForm: string;
  laptop: boolean;
  laptopDate: string;
  officeSpace: boolean;
  officeSpaceDate: string;
  orientation: boolean;
  orientationDate: string;
  orientationImpact: boolean;
  impact: string;
  employeeHandBook: boolean;
  employeeHandBookDate: string;
  completed: boolean;
  approved: string;
  dateSubmitted: string;
  dateUpdated: any;
}

type Props = {
  integrationData: unknown;
  employeeData: IGetEmployeeEnrollmentRes;
};

const IntegrationFormView = ({ integrationData, employeeData }: Props) => {
  const integrationInfo = integrationData as IIntegrationData;

  return (
    <div className="ml-auto w-full max-w-[744px] pb-6">
      <Jumbotron headerText="Integration Form">
        <div className="flex flex-col gap-[18px] p-[23px]">
          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Name"
              value={
                employeeData?.employeeBioData?.basicInformation?.fullname ??
                "--"
              }
            />
            <RowView
              name="Date of Resumption"
              value={shortDate(employeeData?.employmentDetails?.hireDate) ?? "--"}
            />
            <RowView
              name="Department"
              value={employeeData?.employmentDetails?.department ?? "--"}
            />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Were you introduced to everyone when you joined?"
              value={integrationInfo.introducedToEveryone ? "Yes" : "No"}
              align="start"
            />
            <RowView
              name="Date"
              value={shortDate(integrationInfo.dateIntroducedToEveryone) ?? "--"}
            />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Were you given an employee data form to fill?"
              value={integrationInfo.givenEmplyeeDataForm ? "Yes" : "No"}
              align="start"
            />
            <RowView
              name="Date"
              value={shortDate(integrationInfo.dateGivenEmplyeeDataForm) ?? "--"}
            />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Were you given HMO, Referee and Guarantor’s forms"
              value={
                integrationInfo.givenHmoRefereeAndGuarantorForm ? "Yes" : "No"
              }
              align="center"
            />
            {!integrationInfo.givenHmoRefereeAndGuarantorForm && (
              <AttentionBanner title="This requires HR Attention" />
            )}
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Laptop"
              value={integrationInfo.laptop ? "Yes" : "No"}
              align="start"
            />
            <RowView name="Date" value={shortDate(integrationInfo.laptopDate) ?? "--"} />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Office Space"
              value={integrationInfo.officeSpace ? "Yes" : "No"}
              align="start"
            />
            <RowView
              name="Date"
              value={shortDate(integrationInfo.officeSpaceDate) ?? "--"}
            />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Orientation"
              value={integrationInfo.orientation ? "Yes" : "No"}
              align="start"
            />
            {!integrationInfo.orientation && (
              <AttentionBanner title="This requires HR Attention" />
            )}
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Did the orientation have an impact?"
              value={integrationInfo.orientationImpact ? "Yes" : "No"}
              align="start"
            />
            <RowView name="Impact" value={integrationInfo.impact ?? "--"} />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="A hard/soft copy of the employee handbook"
              value={integrationInfo.employeeHandBook ? "Yes" : "No"}
              align="start"
            />
            <RowView
              name="Date"
              value={shortDate(integrationInfo.employeeHandBookDate) ?? "--"}
            />
            <hr />
          </div>

          <div className="grid grid-cols-1 gap-[18px]">
            <RowView
              name="Signature"
              value={integrationInfo.completed ? "Yes" : "No"}
            />
            <RowView
              name="Date"
              value={shortDate(integrationInfo.dateSubmitted) ?? "--"}
            />
          </div>
        </div>
      </Jumbotron>
    </div>
  );
};

export default IntegrationFormView;
