import React from "react";
import { InfoIcon2 } from "@/assets/svgs";
import {
  DocumentViewer,
  EmptyPageState,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { ITrainingCertificationApi } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";

type Props = {
  onClick: (step: string) => void;
  trainingCertificationData: ITrainingCertificationApi[];
};

export const TrainingCertificationView = ({
  onClick,
  trainingCertificationData,
}: Props) => {
  if (trainingCertificationData.length > 0) {
    return (
      <FormStepJumbotron
        title="Training/Certification"
        currentStep={8}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[6])}
        onNext={() => onClick(TAB_QUERIES[8])}
        isPreview
        maxWidth="max-w-[935px]"
      >
        {trainingCertificationData.map((certificate, index) => (
          <div className="flex flex-col gap-[18px]" key={index}>
            <Typography
              fontWeight="medium"
              className="mt-2"
              variant="h-xs"
              color="N100"
            >
              Certification {index + 1}
            </Typography>
            <RowView name={"Name of Certification"} value={certificate?.name} />

            <RowView name={"Institution"} value={certificate?.institution} />
            <RowView name={"Location"} value={certificate?.location} />

            <RowView name={"Date "} value={certificate?.to} />
            <RowView
              name={"Certificate"}
              value={
                <DocumentViewer
                  name={`Certificate ${index + 1}`}
                  link={certificate.certificate}
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
        title="Training/Certification"
        currentStep={8}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[6])}
        onNext={() => onClick(TAB_QUERIES[8])}
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
