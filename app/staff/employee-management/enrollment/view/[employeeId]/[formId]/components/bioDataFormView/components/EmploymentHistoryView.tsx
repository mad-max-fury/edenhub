import React from "react";
import { InfoIcon2 } from "@/assets/svgs";
import {
  EmptyPageState,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { IEmploymentHistoryProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";
import { shortDate } from "@/utils/helpers";

type Props = {
  onClick: (step: string) => void;
  employmentHistoryData: IEmploymentHistoryProps[];
};

export const EmploymentHistoryView = ({
  onClick,
  employmentHistoryData,
}: Props) => {
  if (employmentHistoryData?.length > 0) {
    return (
      <FormStepJumbotron
        title="Employment History"
        currentStep={5}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[3])}
        onNext={() => onClick(TAB_QUERIES[5])}
        maxWidth="max-w-[935px]"
      >
        {employmentHistoryData.map((history, index) => (
          <div className="flex flex-col gap-[18px]" key={index}>
            <Typography
              fontWeight="medium"
              className="mt-2"
              variant="h-xs"
              color="N100"
            >
              PREVIOUS Employment {index + 1}
            </Typography>
            <RowView name={"Position"} value={history?.position} />
            <RowView name={"Organization"} value={history?.organisation} />
            <RowView
              name={"Year Employed"}
              value={`${shortDate(history.from) } - ${shortDate(history?.to)}`}
            />
          </div>
        ))}
      </FormStepJumbotron>
    );
  } else {
    return (
      <FormStepJumbotron
        title="Employment History"
        currentStep={5}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[3])}
        onNext={() => onClick(TAB_QUERIES[5])}
        maxWidth="max-w-[935px]"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex w-[50%] items-center justify-center p-4 [&>*]:flex [&>*]:flex-col [&>*]:items-center">
            <EmptyPageState
              icon={<InfoIcon2 />}
              text="You didn’t fill out this section"
            />
          </div>
        </div>
      </FormStepJumbotron>
    );
  }
};
