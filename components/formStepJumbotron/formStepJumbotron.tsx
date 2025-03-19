import React from "react";
import { Button, Jumbotron, Typography } from "@/components";
import { cn } from "@/utils/helpers";

interface FormStepJumbotronProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  isPreview?: boolean;
  noPadding?: boolean;
  disabled?: boolean;
  primaryLabel?: string;
  maxWidth?: string;
  additionalActions?: React.ReactElement;
}

export const FormStepJumbotron: React.FC<FormStepJumbotronProps> = ({
  title,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  children,
  isLoading = false,
  isPreview = false,
  noPadding = false,
  disabled = false,
  primaryLabel,
  maxWidth,
  additionalActions,
}) => {
  return (
    <div className={cn("ml-auto pb-6", maxWidth ?? "max-w-[744px]")}>
      <Jumbotron
        headerContainer={
          <div className="flex justify-between">
            <Typography variant="h-m" color="text-default">
              {title}
            </Typography>
            <div>{totalSteps > 1 && `${currentStep} / ${totalSteps}`}</div>
          </div>
        }
        footerContent={
          <div className="flex w-full items-center justify-end gap-2">
            {onBack && currentStep !== 0 && (
              <Button disabled={isLoading} variant="secondary" onClick={onBack}>
                {currentStep === totalSteps && !isPreview
                  ? "Back to Edit"
                  : "Back"}
              </Button>
            )}
            {onNext && (
              <Button
                disabled={isLoading || disabled}
                loading={isLoading}
                variant="primary"
                onClick={onNext}
              >
                {primaryLabel
                  ? primaryLabel
                  : isPreview
                    ? "Preview"
                    : currentStep === totalSteps
                      ? "Initiate Onboarding"
                      : "Next"}
              </Button>
            )}
            {additionalActions && additionalActions}
          </div>
        }
      >
        <div
          className={cn(
            "w-full px-5",
            noPadding ? "px-0 [&>form>div]:px-5" : "",
          )}
        >
          {children}
        </div>
      </Jumbotron>
    </div>
  );
};
