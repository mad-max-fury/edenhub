import React from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { IOnboardingTask } from "@/redux/api";
import {
  IBioDataProps,
  initBioData,
  setBioDataEmployeeId,
  setStaffId,
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
      link: AuthRouteConfig.OLD_STAFF_ONBOARDING_BIO_DATA,
      action: () => {
        const bioDataDetails = formDetails as IBioDataProps;
        console.log(bioDataDetails);

        if (bioDataDetails?.basicInformation?.employeeId) {
          dispatch(initBioData(bioDataDetails));
          dispatch(
            setBioDataEmployeeId(bioDataDetails?.basicInformation?.employeeId),
          );
          dispatch(setStaffId(bioDataDetails?.staffId));
        }
      },
    },
    [String(OnboardingEnum.INFORMATION_UPDATE)]: {
      link: AuthRouteConfig.OLD_STAFF_ONBOARDING_INFO_UPDATE,
      action: () => {},
    },
  };
  const router = useRouter();
  const dispatch = useDispatch();
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
        {approved === "Pending" && (
          <Button
            variant="secondary"
            disabled={disabled}
            onClick={() => {
              router.push(onboardingLink[taskId].link);
              onboardingLink[taskId].action();
            }}
          >
            {"Begin"}
          </Button>
        )}
      </div>
    </div>
  );
};
