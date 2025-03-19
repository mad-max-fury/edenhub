import React from "react";
import { DocumentViewer, FormStepJumbotron, RowView } from "@/components";

type Props = {
  onClick: (step: string) => void;
  document: string;
  documents: string[];
  tabQuerys: string[];
  currentStep: number;
  prevStep: number;
};

export const ViewDoc = ({
  onClick,
  document,
  tabQuerys,
  documents,
  currentStep,
  prevStep,
}: Props) => {
  const isLastStep = currentStep === tabQuerys.length;
  return (
    <FormStepJumbotron
      title={document}
      currentStep={currentStep}
      totalSteps={tabQuerys.length}
      onBack={
        currentStep === 1 ? undefined : () => onClick(tabQuerys[prevStep - 1])
      }
      onNext={isLastStep ? undefined : () => onClick(tabQuerys[currentStep])}
      isLoading={false}
      isPreview={isLastStep}
    >
      <div className="flex flex-col gap-[18px]">
        <RowView
          name={document}
          value={
            <div className="grid grid-cols-1 gap-6">
              {documents.map((doc, index) => (
                <DocumentViewer
                  key={index}
                  name={`${document} ${index + 1}.pdf`}
                  link={doc}
                />
              ))}
            </div>
          }
        />
      </div>
    </FormStepJumbotron>
  );
};
