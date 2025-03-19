import React from "react";
import { FormStepJumbotron, RowView, Typography } from "@/components";
import { INextOfKinFormResponseProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";

type Props = {
  onClick: (step: string) => void;
  nextOfKinData: INextOfKinFormResponseProps;
};

export const NextOfKinView = ({ onClick, nextOfKinData }: Props) => {
  return (
    <FormStepJumbotron
      title="Emergency Contacts"
      currentStep={4}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[2])}
      onNext={() => onClick(TAB_QUERIES[4])}
      maxWidth="max-w-[935px]"
    >
      <div className="flex flex-col gap-[18px]">
        <Typography
          fontWeight="medium"
          className="mt-2"
          variant="h-xs"
          color="N100"
        >
          Next Of Kin
        </Typography>
        <RowView
          name={"Full Name"}
          value={`${nextOfKinData?.firstname} ${nextOfKinData?.middlename} ${nextOfKinData?.lastname}`}
        />
        <RowView name={"Residential Address"} value={nextOfKinData?.address} />
        <RowView name={"Primary Phone"} value={nextOfKinData?.phoneNumber} />
        <RowView name={"Email Address"} value={nextOfKinData?.email} />{" "}
        <RowView name={"Relationship"} value={nextOfKinData?.relationship} />
      </div>
    </FormStepJumbotron>
  );
};
