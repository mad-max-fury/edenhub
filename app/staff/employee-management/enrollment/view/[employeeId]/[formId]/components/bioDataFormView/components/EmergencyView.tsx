import React from "react";
import { FormStepJumbotron, RowView, Typography } from "@/components";
import { IEmergencyContactsResponseProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";

type Props = {
  onClick: (step: string) => void;
  emergencyData: IEmergencyContactsResponseProps;
};

export const EmergencyView = ({ onClick, emergencyData }: Props) => {
  return (
    <FormStepJumbotron
      title="Emergency Contacts"
      currentStep={3}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[1])}
      onNext={() => onClick(TAB_QUERIES[3])}
      maxWidth="max-w-[935px]"
    >
      <div className="flex flex-col gap-[18px]">
        <Typography
          fontWeight="medium"
          className="mt-2"
          variant="h-xs"
          color="N100"
        >
          Emergency Contact
        </Typography>
        <RowView
          name={"Full Name"}
          value={`${emergencyData?.firstname} ${emergencyData?.middlename} ${emergencyData?.lastname}`}
        />
        <RowView name={"Residential Address"} value={emergencyData?.address} />
        <RowView name={"Primary Phone"} value={emergencyData?.phoneNumber} />
        <RowView name={"Email Address"} value={emergencyData?.email} />{" "}
        <RowView name={"Relationship"} value={emergencyData?.relationship} />
      </div>
    </FormStepJumbotron>
  );
};
