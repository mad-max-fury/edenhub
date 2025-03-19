import React from "react";
import { InfoIcon2 } from "@/assets/svgs";
import {
  EmptyPageState,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { IDependantResponseProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";
import { shortDate } from "@/utils/helpers";

type Props = {
  onClick: (step: string) => void;
  dependantsForm: IDependantResponseProps[];
};

export const DependantView = ({ onClick, dependantsForm }: Props) => {
  if (dependantsForm.length > 0) {
    return (
      <FormStepJumbotron
        title="Dependant"
        currentStep={2}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[0])}
        onNext={() => onClick(TAB_QUERIES[2])}
        maxWidth="max-w-[935px]"
      >
        {dependantsForm.map((dependant, index) => (
          <div className="flex flex-col gap-[18px]" key={index}>
            <Typography
              fontWeight="medium"
              className="mt-2"
              variant="h-xs"
              color="N100"
            >
              DEPENDANT {index + 1}
            </Typography>
            <RowView name={"Relationship"} value={dependant?.relationship} />
            <RowView name={"Full Name"} value={dependant?.name} />
            <RowView name={"Date of Birth"} value={shortDate(dependant?.dateOfBirth)} />
            <RowView name={"Sex"} value={dependant?.gender} />
          </div>
        ))}
      </FormStepJumbotron>
    );
  } else {
    return (
      <FormStepJumbotron
        title="Dependant"
        currentStep={2}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[0])}
        onNext={() => onClick(TAB_QUERIES[2])}
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
