import React from "react";
import {
  DocumentViewer,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { IPersonalInfoProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";
import { shortDate } from "@/utils/helpers";

type Props = {
  onClick: (step: string) => void;
  personalData: IPersonalInfoProps;
  staffId: string;
};

export const PersonalInfoView = ({ onClick, personalData, staffId }: Props) => {
  const isMarried = personalData?.maritalStatus.toLowerCase() === "married";

  return (
    <FormStepJumbotron
      title="Personal Information"
      currentStep={1}
      totalSteps={TAB_QUERIES.length}
      onNext={() => onClick(TAB_QUERIES[1])}
      isLoading={false}
      maxWidth="max-w-[935px]"
    >
      <div className="flex flex-col gap-[18px]">
        <Typography
          fontWeight="medium"
          className="mt-2"
          variant="h-xs"
          color="N100"
        >
          Employment Details
        </Typography>
        <RowView name={"Employee ID"} value={staffId} />
        <RowView name={"Email Address"} value={personalData?.email} />
        <Typography
          fontWeight="medium"
          className="mt-2"
          variant="h-xs"
          color="N100"
        >
          Personal Information
        </Typography>
        <RowView name={"Full Name"} value={personalData?.fullname} />{" "}
        <RowView name={"Email Address"} value={personalData?.email} />{" "}
        <RowView name={"Residential Address"} value={personalData?.address} />{" "}
        <RowView name={"Primary Phone"} value={personalData?.phoneNumber} />{" "}
        <RowView
          name={"Alternative Phone"}
          value={personalData?.alternatePhoneNumber}
        />
        <RowView name={"State of Origin"} value={personalData?.state} />{" "}
        <RowView name={"LGA"} value={personalData?.lga} />{" "}
        <RowView name={"Religion"} value={personalData?.religion} />{" "}
        <RowView name={"Date of Birth"} value={shortDate(personalData?.dateOfBirth)} />{" "}
        <RowView name={"Sex"} value={personalData?.maritalStatus} />{" "}
        <RowView name={"Marital Status"} value={personalData?.gender ?? "-"} />
        {isMarried && (
          <RowView
            name={"Marriage Certificate"}
            value={
              <div className="max-w-[349px]">
                <DocumentViewer
                  name="Marriage.png"
                  link={personalData?.marriageCertificate ?? ""}
                />
              </div>
            }
          />
        )}
      </div>
    </FormStepJumbotron>
  );
};
