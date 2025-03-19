import React from "react";
import { InfoIcon2 } from "@/assets/svgs";
import {
  DocumentViewer,
  EmptyPageState,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { IProfessionalQualificationProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";

type Props = {
  onClick: (step: string) => void;
  professionalQualificationData: Array<
    Omit<IProfessionalQualificationProps, "certificate"> & {
      certificate: string;
    }
  >;
};

export const ProfessionalQualificationView = ({
  onClick,
  professionalQualificationData,
}: Props) => {
  if (professionalQualificationData.length > 0) {
    return (
      <FormStepJumbotron
        title="Professional Qualification"
        currentStep={7}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[5])}
        onNext={() => onClick(TAB_QUERIES[7])}
        isLoading={false}
        maxWidth="max-w-[935px]"
      >
        {professionalQualificationData?.map((qualification, index) => (
          <div className="flex flex-col gap-[18px]" key={index}>
            <Typography
              fontWeight="medium"
              className="mt-2"
              variant="h-xs"
              color="N100"
            >
              QUALIFICATION {index + 1}
            </Typography>
            <RowView
              name={"Qualification"}
              value={qualification.qualification}
            />

            <RowView name={"Institution"} value={qualification?.institution} />
            <RowView
              name={"Year Obtained"}
              value={`${qualification.from} - ${qualification?.to}`}
            />
            <RowView
              name={"Certificate"}
              value={
                <DocumentViewer
                  name={`Certificate ${index + 1}`}
                  link={qualification?.certificate}
                />
              }
            />
          </div>
        ))}
      </FormStepJumbotron>
    );
  } else {
    return (
      <FormStepJumbotron
        title="Professional Qualification"
        currentStep={7}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[5])}
        onNext={() => onClick(TAB_QUERIES[7])}
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
