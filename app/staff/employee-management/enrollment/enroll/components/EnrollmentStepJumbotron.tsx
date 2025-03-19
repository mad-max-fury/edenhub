import React from "react";
import { Button, Jumbotron, Typography } from "@/components";
import { cn } from "@/utils/helpers";

interface EnrollmentStepJumbotronProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
}

const EnrollmentStepJumbotron: React.FC<EnrollmentStepJumbotronProps> = ({
  title,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  children,
}) => {
  return (
    <div className="ml-auto max-w-[744px] pb-6">
      <Jumbotron
        headerContainer={
          <div className="flex justify-between">
            <Typography variant="h-m" color="text-default">
              {title}
            </Typography>
            <div>
              {currentStep} / {totalSteps}
            </div>
          </div>
        }
        footerContent={
          <div className="flex w-full items-center justify-end gap-2">
            {onBack && currentStep !== 0 && (
              <Button variant="secondary" onClick={onBack}>
                {currentStep === totalSteps ? "Back to Edit" : "Back"}
              </Button>
            )}
            {onNext && (
              <Button variant="primary" onClick={onNext}>
                {currentStep === 4
                  ? "Preview"
                  : currentStep === totalSteps
                    ? "Initiate Onboarding"
                    : "Next"}
              </Button>
            )}
          </div>
        }
      >
        <div
          className={cn(
            "w-full px-5",
            currentStep === 4 ? "px-0 [&>form>div]:px-5" : "",
          )}
        >
          {children}
        </div>
      </Jumbotron>
    </div>
  );
};

export default EnrollmentStepJumbotron;
