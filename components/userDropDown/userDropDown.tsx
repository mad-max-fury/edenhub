"use client";

import React, { useContext } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

import { Avatar } from "../avatar";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import Link from "next/link";
import { ViewProfile } from "@/assets/svgs";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import { IVerifyUserResponse } from "@/redux/api";
import useAuthAction from "@/utils/useAuthAction";

import { Typography } from "../typography";

interface UserDropDownProps {
  oldUser?: boolean;
  user?: IVerifyUserResponse | null;
  olduserLogout?: () => void;
}

export const UserDropDown = ({
  oldUser = false,
  user,
  olduserLogout,
}: UserDropDownProps) => {
  const { logout } = useAuthAction();
  const data = useContext(UserContext);

  const handleLogout = () => logout();

  return (
    <Menu
      menuButton={
        <MenuButton className={"group h-fit w-fit"}>
          {oldUser ? (
            <Avatar
              size="sm"
              src={user?.profilePicture}
              fullname={`${user?.fullName}`}
            />
          ) : (
            <Avatar
              size="sm"
              src={data?.user?.profilePicture}
              fullname={`${data?.user?.firstname} ${data?.user?.lastname}`}
            />
          )}
        </MenuButton>
      }
      className={
        "[&>ul.szh-menu]:!top-[30px] [&>ul.szh-menu]:!dropdown-menu-box-shadow"
      }
      transition
      align="end"
      arrow
    >
      <div className={"w-[90vw] max-w-[300px]"}>
        {oldUser ? (
          <>
            <Typography
              variant={"c-s"}
              fontWeight={"bold"}
              className={"pb-2 pl-5 pt-5"}
              color={"N200"}
              customClassName="cursor-pointer"
            >
              {user?.fullName}
            </Typography>
            <hr className="divider my-2 !h-[2px]" />
            <MenuItem onClick={olduserLogout} className={"!py-2 !pl-5"}>
              <Typography variant={"c-m"} color={"N800"} className="">
                Logout
              </Typography>
            </MenuItem>
          </>
        ) : (
          <>
            <Typography
              variant={"c-s"}
              fontWeight={"bold"}
              className={"pb-2 pl-5 pt-5"}
              color={"N200"}
              customClassName="cursor-pointer"
            >
              {`${data?.user?.firstname} ${data?.user?.lastname}`}
            </Typography>
            <MenuItem className={"!py-2 !pl-5"}>
              <Link
                href={AuthRouteConfig.PROFILE}
                className="flex items-center justify-center gap-3"
              >
                <ViewProfile />
                <Typography variant={"c-m"} color={"N800"} className="">
                  View Profile
                </Typography>
              </Link>
            </MenuItem>

            {/* <div className="flex flex-col">
              <Typography
                variant={"c-s"}
                fontWeight={"bold"}
                className={"pb-2 pl-5 pt-5"}
                color={"N200"}
                customClassName="cursor-pointer"
              >
                Use Resource Edge as
              </Typography>
              {userAccessibleRoles?.map((el) => (
                <RoleStatusCard
                  {...el}
                  onRoleAction={() => activateRole(el.roleStatus)}
                  key={el.roleStatus}
                  isActive={el.roleStatus === activeRole}
                />
              ))}
            </div> */}

            <hr className="divider my-2 !h-[2px]" />
            <MenuItem onClick={handleLogout} className={"!py-2 !pl-5"}>
              <Typography variant={"c-m"} color={"N800"} className="">
                Logout
              </Typography>
            </MenuItem>
          </>
        )}
      </div>
    </Menu>
  );
};

// interface IRoleStatusCardProps {
//   roleStatus: string;
//   isActive?: boolean;
//   onRoleAction?: () => void;
//   icon: React.ReactNode;
// }

// const RoleStatusCard = ({
//   roleStatus,
//   isActive,
//   onRoleAction,
//   icon,
// }: IRoleStatusCardProps) => {
//   return (
//     <MenuItem onClick={onRoleAction} className={"flex items-center !px-5"}>
//       <span className="flex flex-1 flex-grow items-center gap-2">
//         {icon}
//         <Typography variant={"c-m"} color={"N800"}>
//           {roleStatus}
//         </Typography>
//       </span>
//       {isActive && <CheckIcon />}
//     </MenuItem>
//   );
// };
