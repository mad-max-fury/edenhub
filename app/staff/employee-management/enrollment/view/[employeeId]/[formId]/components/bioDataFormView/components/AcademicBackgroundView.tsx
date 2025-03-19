import React from "react";
import { InfoIcon2 } from "@/assets/svgs";
import {
  DocumentViewer,
  EmptyPageState,
  FormStepJumbotron,
  RowView,
  Typography,
} from "@/components";
import { IAcademicBackgroundResponseProps } from "@/redux/api";

import { BIO_DATA_FORM_VIEW_TAB_QUERIES as TAB_QUERIES } from "../../constants";
import { shortDate } from "@/utils/helpers";

type Props = {
  onClick: (step: string) => void;
  academicBackgroundData: IAcademicBackgroundResponseProps[];
};

export const AcademicBackgroundView = ({
  onClick,
  academicBackgroundData,
}: Props) => {
  if (academicBackgroundData.length > 0) {
    return (
      <FormStepJumbotron
        title="Academic Background"
        currentStep={6}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[5])}
        onNext={() => onClick(TAB_QUERIES[6])}
        isLoading={false}
        maxWidth="max-w-[935px]"
      >
        {academicBackgroundData.map((academicBackground, index) => (
          <div className="flex flex-col gap-[18px]" key={index}>
            <Typography
              fontWeight="medium"
              className="mt-2"
              variant="h-xs"
              color="N100"
            >
              SCHOOL {index + 1}
            </Typography>
            <RowView name={"School"} value={academicBackground?.school} />

            <RowView name={"Major"} value={academicBackground?.major} />
            <RowView name={"Degree"} value={academicBackground.qualification} />
            <RowView
              name={"Date Attended"}
              value={`${shortDate(academicBackground?.from)} - ${shortDate(academicBackground?.to)}`}
            />
            <RowView
              name={"Certificate"}
              value={
                <DocumentViewer
                  name={`Certificate ${index + 1}`}
                  link={academicBackground?.certificate}
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
        title="Academic Background"
        currentStep={6}
        totalSteps={TAB_QUERIES.length}
        onBack={() => onClick(TAB_QUERIES[4])}
        onNext={() => onClick(TAB_QUERIES[6])}
        isLoading={false}
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
