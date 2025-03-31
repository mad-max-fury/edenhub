"use client";

import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

import { Avatar } from "../avatar";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import Link from "next/link";
import { UserIcon, ViewProfile } from "@/assets/svgs";
import { AuthRouteConfig } from "@/constants/routes";
import { IVerifyUserResponse } from "@/redux/api";
import useAuthAction from "@/utils/useAuthAction";

import { Typography } from "../typography";
import { Button } from "../buttons";

interface UserDropDownProps {
  user?: IVerifyUserResponse | null;
  onLogout?: () => void;
}

export const UserDropDown = ({ user, onLogout }: UserDropDownProps) => {
  const { logout } = useAuthAction();

  // Determine the display name and profile picture
  const displayName = user ? user.fullName : "Guest";

  const profilePicture = user?.profilePicture;

  // Use provided logout or default logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <Menu
      menuButton={
        <MenuButton className={"group h-fit w-fit"}>
          {Boolean(user) ? (
            <Avatar size="md" src={profilePicture} fullname={displayName} />
          ) : (
            <Button
              shape={"pill"}
              variant={"gold"}
              size={"plain"}
              className={" aspect-square h-[50px]"}
            >
              <UserIcon />
            </Button>
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
        <Typography
          variant={"c-s"}
          fontWeight={"bold"}
          className={"pb-2 pl-5 pt-5"}
          color={"N200"}
          customClassName="cursor-pointer"
        >
          {displayName}
        </Typography>

        {user && (
          <>
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

            <hr className="divider my-2 !h-[2px]" />
          </>
        )}

        {user ? (
          <MenuItem onClick={handleLogout} className={"!py-2 !pl-5"}>
            <Typography variant={"c-m"} color={"N800"} className="">
              Logout
            </Typography>
          </MenuItem>
        ) : (
          <>
            <MenuItem className={"!py-2 !pl-5"}>
              <Link href={AuthRouteConfig.LOGIN}>
                <Typography variant={"c-m"} color={"N800"} className="">
                  Login
                </Typography>
              </Link>
            </MenuItem>
            <MenuItem className={"!py-2 !pl-5"}>
              <Link href={AuthRouteConfig.LOGIN}>
                <Typography variant={"c-m"} color={"N800"} className="">
                  Signup
                </Typography>
              </Link>
            </MenuItem>
          </>
        )}
      </div>
    </Menu>
  );
};
