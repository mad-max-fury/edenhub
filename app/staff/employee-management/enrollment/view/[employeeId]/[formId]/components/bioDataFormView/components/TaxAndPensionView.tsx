import React from "react";
import { InfoIcon2 } from "@/assets/svgs";
import {
  EmptyPageState,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { ITaxPensionsResponseProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";

type Props = {
  onClick: (step: string) => void;
  taxAndPensionData: ITaxPensionsResponseProps;
};

export const TaxAndPensionView = ({ onClick, taxAndPensionData }: Props) => {
  const hasData = Array.isArray(taxAndPensionData)
    ? taxAndPensionData.length > 0
    : Object.values(taxAndPensionData ?? {}).length > 0;

  return (
    <FormStepJumbotron
      title="Tax and Pensions"
      currentStep={10}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[8])}
      maxWidth="max-w-[935px]"
    >
      {hasData ? (
        Array.isArray(taxAndPensionData) ? (
          taxAndPensionData.map((taxAndPension, index) => (
            <div className="flex flex-col gap-[18px]" key={index}>
              <Typography
                fontWeight="medium"
                className="mt-2"
                variant="h-xs"
                color="N100"
              >
                TAX/PENSION
              </Typography>
              <RowView
                name={"Fund Advisor"}
                value={taxAndPension?.fundsAdministrator ?? "-"}
              />
              <RowView
                name={"Pension Number"}
                value={taxAndPension?.pensionPin ?? "-"}
              />
              <RowView name={"Tax ID"} value={taxAndPension?.taxId ?? "-"} />
              <RowView name={"NHF"} value={taxAndPension?.nhs ?? "-"} />
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-[18px]">
            <Typography
              fontWeight="medium"
              className="mt-2"
              variant="h-xs"
              color="N100"
            >
              TAX/PENSION
            </Typography>
            <RowView
              name={"Fund Advisor"}
              value={taxAndPensionData?.fundsAdministrator ?? "-"}
            />
            <RowView
              name={"Pension Number"}
              value={taxAndPensionData?.pensionPin ?? "-"}
            />
            <RowView name={"Tax ID"} value={taxAndPensionData?.taxId ?? "-"} />
            <RowView name={"NHF"} value={taxAndPensionData?.nhs ?? "-"} />
          </div>
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex w-[50%] items-center justify-center p-4 [&>*]:flex [&>*]:flex-col [&>*]:items-center">
            <EmptyPageState
              icon={<InfoIcon2 />}
              text="You didn’t fill out this section"
            />
          </div>
        </div>
      )}
    </FormStepJumbotron>
  );
};
