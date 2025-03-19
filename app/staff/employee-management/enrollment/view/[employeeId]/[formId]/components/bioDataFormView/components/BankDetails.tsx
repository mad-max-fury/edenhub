import React from "react";
import { FormStepJumbotron, RowView, Typography } from "@/components";
import { BankDetailsProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";

type Props = {
  onClick: (step: string) => void;
  BankDetailsView: BankDetailsProps;
};

export const BankDetails = ({ onClick, BankDetailsView }: Props) => {
  return (
    <FormStepJumbotron
      title="Bank Details"
      currentStep={9}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[7])}
      onNext={() => onClick(TAB_QUERIES[9])}
      maxWidth="max-w-[935px]"
    >
      {[BankDetailsView].map((bankdetails, index) => (
        <div className="flex flex-col gap-[18px]" key={index}>
          <Typography
            fontWeight="medium"
            className="mt-2"
            variant="h-xs"
            color="N100"
          >
            Bank Details
          </Typography>
          <RowView name={"Bank Name"} value={bankdetails?.bankName} />

          <RowView name={"Account Name"} value={bankdetails?.accountName} />
          <RowView name={"Account Number"} value={bankdetails?.accountNumber} />
        </div>
      ))}
    </FormStepJumbotron>
  );
};
