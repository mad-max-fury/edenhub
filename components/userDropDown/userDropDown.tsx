"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

import { Avatar } from "../avatar";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, MapPin, Package, Star, User } from "lucide-react";
import { UserIcon } from "@/assets/svgs";
import { AuthRouteConfig } from "@/constants/routes";
import { IUser } from "@/redux/api/auth";
import useAuthAction from "@/utils/useAuthAction";

import { Typography } from "../typography";
import { Button } from "../buttons";
import { ConfirmationModal } from "../confirmationModal/confirmationModal";

interface UserDropDownProps {
  user?: IUser | null;
  onLogout?: () => void;
}

const accountLinks = [
  { label: "View Profile", href: AuthRouteConfig.ACCOUNT, icon: User },
  { label: "My Orders", href: AuthRouteConfig.ACCOUNT_ORDERS, icon: Package },
  { label: "Saved Items", href: AuthRouteConfig.ACCOUNT_SAVED, icon: Heart },
  {
    label: "Addresses",
    href: AuthRouteConfig.ACCOUNT_ADDRESSES,
    icon: MapPin,
  },
  { label: "My Reviews", href: AuthRouteConfig.ACCOUNT_REVIEWS, icon: Star },
];

export const UserDropDown = ({ user, onLogout }: UserDropDownProps) => {
  const { logout } = useAuthAction();
  const pathname = usePathname();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const returnToParam = `?returnTo=${encodeURIComponent(pathname)}`;

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Guest";

  const profilePicture = user?.profilePicture;

  const handleLogout = () => {
    setConfirmOpen(false);
    if (onLogout) onLogout();
    else logout();
  };

  return (
    <>
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
        <div className={"w-[90vw] max-w-[300px] py-2"}>
          {user ? (
            <>
              <div className="flex items-center gap-3 px-5 pb-3 pt-2">
                <Avatar size="md" src={profilePicture} fullname={displayName} />
                <div className="min-w-0">
                  <Typography
                    variant={"c-m"}
                    fontWeight={"bold"}
                    color={"N800"}
                    className="truncate"
                  >
                    {displayName}
                  </Typography>
                  {user.email && (
                    <Typography
                      variant={"p-s"}
                      color={"N200"}
                      className="text-xs truncate"
                    >
                      {user.email}
                    </Typography>
                  )}
                </div>
              </div>

              <hr className="divider my-1 !h-[2px]" />

              {accountLinks.map(({ label, href, icon: Icon }) => (
                <MenuItem key={href} className={"!py-2.5 !px-5"}>
                  <Link href={href} className="flex items-center gap-3 w-full">
                    <Icon size={18} className="text-BR400 shrink-0" />
                    <Typography variant={"c-m"} color={"N800"}>
                      {label}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}

              <hr className="divider my-1 !h-[2px]" />

              <MenuItem
                onClick={() => setConfirmOpen(true)}
                className={"!py-2.5 !px-5"}
              >
                <span className="flex items-center gap-3 w-full">
                  <LogOut size={18} className="text-R400 shrink-0" />
                  <Typography variant={"c-m"} color={"R400"}>
                    Logout
                  </Typography>
                </span>
              </MenuItem>
            </>
          ) : (
            <>
              <Typography
                variant={"c-s"}
                fontWeight={"bold"}
                className={"pb-1 pl-5 pt-3"}
                color={"N200"}
              >
                Welcome
              </Typography>
              <Typography
                variant={"p-s"}
                className={"pb-3 pl-5 text-xs"}
                color={"N200"}
              >
                Sign in for orders, saved items & more.
              </Typography>

              <hr className="divider my-1 !h-[2px]" />

              <MenuItem className={"!py-2.5 !px-5"}>
                <Link
                  href={`${AuthRouteConfig.LOGIN}${returnToParam}`}
                  className="w-full"
                >
                  <Typography variant={"c-m"} color={"N800"}>
                    Login
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem className={"!py-2.5 !px-5"}>
                <Link
                  href={`${AuthRouteConfig.SIGNUP}${returnToParam}`}
                  className="w-full"
                >
                  <Typography variant={"c-m"} color={"N800"}>
                    Create account
                  </Typography>
                </Link>
              </MenuItem>
            </>
          )}
        </div>
      </Menu>

      <ConfirmationModal
        isOpen={confirmOpen}
        closeModal={() => setConfirmOpen(false)}
        formTitle="Log out"
        message={
          <Typography color="N600">
            Are you sure you want to log out of your account?
          </Typography>
        }
        buttonLabel="Log out"
        handleClick={handleLogout}
        type="confirm"
        isLoading={false}
      />
    </>
  );
};
