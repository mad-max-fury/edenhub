"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPinIcon } from "@/assets/svgs";
import {
  Avatar,
  Badge,
  ButtonDropdown,
  ConfirmationModal,
  notify,
  PageHeader,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IGetEmployeeEnrollmentRes,
  initBioData,
  setBioDataEmployeeId,
  useToggleUserActivationStatusMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { mapEmployeeEnrollmentToBioData } from "@/utils/constructorFunction";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useDispatch } from "react-redux";

import { Breadcrumbs, Crumb } from "@/components/breadCrumbs/breadCrumbs";

const getBadgeVariant = (status: "staff" | "active" | "inactive") => {
  switch (status) {
    case "staff":
      return "purple";
    case "active":
      return "green";
    default:
      return "red";
  }
};

interface EmployeeProfileHeaderProps {
  data: IGetEmployeeEnrollmentRes;
  crumbs: Crumb[];
}

export const EmployeeInfoPageHeader = ({
  data,
  crumbs,
}: EmployeeProfileHeaderProps) => {
  const isActive = data?.employeeBioData?.basicInformation.active;
  const { push } = useRouter();
  const [openDeactivate, setOpenDeactive] = useState(false);
  const [toggleUserActivationStatus, { isLoading }] =
    useToggleUserActivationStatusMutation();

  const dispatch = useDispatch();

  const deactiveAction = () => {
    if (data?.employeeBioData?.basicInformation?.employeeId) {
      toggleUserActivationStatus({
        userId: data?.employeeBioData?.basicInformation.userId,
      })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Reminder Sent Successfully`,
            subtitle: `You have successfully reminded ${data?.employeeBioData?.basicInformation.fullname} about their enrollment`,
          });
          setOpenDeactive(false);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Remainder failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const renderModals = () => (
    <>
      <ConfirmationModal
        isOpen={openDeactivate}
        closeModal={() => setOpenDeactive(false)}
        handleClick={deactiveAction}
        formTitle={!isActive ? "Activate Profile" : "Deactivate Profile"}
        message={
          <p>
            Are you sure you want to {isActive ? "deactivate " : "activate "}
            <span className="text-R400">
              {data?.employeeBioData?.basicInformation?.firstname}
            </span>{" "}
            profile
          </p>
        }
        isLoading={isLoading}
        type="delete"
        buttonLabel={isActive ? "Yes, Deactivate" : "Yes, Activate"}
      />
    </>
  );

  return (
    <>
      <div className="absolute">{renderModals()}</div>
      <div className="ml-auto mt-6 flex w-full max-w-[1056px] flex-col items-start md:flex-row md:items-center md:gap-4">
        <Avatar
          fullname={data?.employeeBioData.basicInformation?.fullname}
          size="xxl"
          src={data?.employeeBioData.basicInformation?.profilePicture}
        />
        <div className="mt-4 w-full flex-1 flex-grow text-center md:mt-0 md:text-left">
          <Breadcrumbs crumbs={crumbs} />
          <PageHeader
            title={
              <div className="flex items-center gap-2">
                <Typography variant="c-xxl" fontWeight="medium">
                  {data?.employeeBioData.basicInformation?.fullname ?? "--"}
                </Typography>
                <span>
                  <Badge
                    variant={getBadgeVariant(isActive ? "active" : "inactive")}
                    text={isActive ? "Active" : "Inactive"}
                  />
                </span>
              </div>
            }
            buttonGroup={
              <ButtonDropdown
                colored
                buttonGroup={[
                  {
                    name: "Edit Profile",
                    onClick: () => {
                      if (data?.employeeBioData?.basicInformation?.employeeId) {
                        dispatch(
                          initBioData(mapEmployeeEnrollmentToBioData(data)),
                        );
                        dispatch(
                          setBioDataEmployeeId(
                            data?.employeeBioData?.basicInformation?.employeeId,
                          ),
                        );
                      }
                      return push(
                        `${AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE}/${data?.employeeBioData.basicInformation.employeeId}/edit-profile`,
                      );
                    },
                  },
                  {
                    name: data?.employeeBioData?.basicInformation?.active
                      ? "Deactivate"
                      : "Activate",
                    onClick: () => setOpenDeactive(true),
                  },
                ]}
              />
            }
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Typography variant="c-m" fontWeight={"medium"} color="N900">
                {data?.employmentDetails?.jobDesignation}
              </Typography>
              <Badge
                variant={getBadgeVariant("staff")}
                text={data.employmentType?.employmentType}
              />
            </div>
            <div className="h-1 w-1 rounded-full bg-N800" />
            <div className="flex items-center gap-2">
              <MapPinIcon />
              <Typography variant="c-m" fontWeight={"medium"} color="N500">
                {data?.employmentDetails?.company},{" "}
                {data?.employmentDetails?.workLocation}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
