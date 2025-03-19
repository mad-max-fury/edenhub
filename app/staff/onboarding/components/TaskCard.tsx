"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { IOnboardingTask } from "@/redux/api";
import {
  IAttestationProps,
  IBioDataProps,
  IDocumentResponse,
  IIDCardProps,
  initBioData,
  initIDCardForm,
  resetState,
  setAttestationState,
  setBioDataEmployeeId,
  setInitDocumentState,
} from "@/redux/api/employee";
import { OnboardingEnum } from "@/redux/api/interface";
import { cn } from "@/utils/helpers";
import { useDispatch } from "react-redux";

interface ITaskCardProps extends IOnboardingTask {
  disabled: boolean;
}
export const TaskCard = ({
  title,
  description,
  taskId,
  formDetails,
  completed,
  disabled,
  approved,
}: ITaskCardProps) => {
  const onboardingLink = {
    [String(OnboardingEnum.BIO_DATA)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_BIO_DATA,
      action: () => {
        const bioDataDetails = formDetails as IBioDataProps;
        if (bioDataDetails?.basicInformation?.employeeId) {
          dispatch(initBioData(bioDataDetails));
          dispatch(
            setBioDataEmployeeId(bioDataDetails?.basicInformation?.employeeId),
          );
        }
      },
    },
    [String(OnboardingEnum.ID_CARD)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_ID_CARD,
      action: () => dispatch(initIDCardForm(formDetails as IIDCardProps)),
    },
    [String(OnboardingEnum.ATTESTATION)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_ATTESTATION,
      action: () =>
        dispatch(setAttestationState(formDetails as IAttestationProps)),
    },
    [String(OnboardingEnum.REFERENCE)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_REFERENCE_FORM,
      action: () =>
        dispatch(setAttestationState(formDetails as IAttestationProps)),
    },
    [String(OnboardingEnum.GUARANTORS)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_GUARANTORS_FORM,
      action: () => {},
    },
    [String(OnboardingEnum.INTEGRATION)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_INTEGRATION_FORM,
      action: () =>
        dispatch(setAttestationState(formDetails as IAttestationProps)),
    },
    [String(OnboardingEnum.DOCUMENTS)]: {
      link: AuthRouteConfig.STAFF_ONBOARDING_DOCUMENTS,
      action: () =>
        dispatch(setInitDocumentState(formDetails as IDocumentResponse)),
    },
  };
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
  }, []);
  return (
    <div className="flex h-[226px] flex-col justify-between rounded-[1px] border border-N40 px-5 py-6">
      <div>
        <Typography
          variant="c-m"
          fontWeight="medium"
          className={cn("mb-4 text-N800", disabled && "!text-N50")}
        >
          {title}
        </Typography>
        {completed && (
          <div className="mb-4">
            <Badge
              variant={
                approved === "Pending"
                  ? "yellow"
                  : approved === "Approved"
                    ? "green"
                    : "red"
              }
              text={approved === "Pending" ? "Pending Review" : approved}
            />
          </div>
        )}
        <Typography
          variant="p-s"
          fontWeight="regular"
          className={cn("text-N800", disabled && "!text-N50")}
        >
          {description}
        </Typography>
      </div>
      <div>
        <Button
          variant="secondary"
          disabled={disabled}
          onClick={() => {
            dispatch(resetState());
            if (completed && approved !== "Rejected") {
              router.push(`${AuthRouteConfig.STAFF_ONBOARDING}/view/${taskId}`);
            } else {
              router.push(onboardingLink[taskId].link);
              onboardingLink[taskId].action();
            }
          }}
        >
          {completed && approved === "Rejected"
            ? "Continue"
            : completed
              ? "View"
              : "Begin"}
        </Button>
      </div>
    </div>
  );
};
