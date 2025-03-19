"use client";

import React from "react";
import { AlertIcon } from "@/assets/svgs";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
} from "@szhsin/react-menu";

import { Avatar } from "../avatar";
import { Typography } from "../typography";

export const AppNotification = () => {
  const notificationCount = 10;

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    console.log("Marking all notifications as read");
  };
  return (
    <Menu
      menuButton={
        <MenuButton className={"h-fit w-fit cursor-pointer"}>
          <AlertIcon />
        </MenuButton>
      }
      className={
        "[&>ul.szh-menu]:!top-[30px] [&>ul.szh-menu]:!dropdown-menu-box-shadow"
      }
      transition
      align={"end"}
      arrow
      position={"auto"}
    >
      <div className={"h-screen !max-h-[650px] w-screen max-w-[420px]"}>
        <FocusableItem
          className={
            "flex w-full items-center justify-between pt-4 hover:!bg-white"
          }
        >
          {({ ref }) => (
            <>
              <Typography variant="c-l" color={"text-light"}>
                Notifications ({notificationCount})
              </Typography>

              <MenuButton
                ref={ref}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                className={""}
              >
                <Typography color="B400" variant={"p-s"}>
                  Mark all as read
                </Typography>
              </MenuButton>
            </>
          )}
        </FocusableItem>
        <MenuDivider />
        <MenuGroup
          className={"h-[calc(100%_-_50px)] flex-1 flex-grow overflow-y-scroll"}
          takeOverflow
        >
          {Array(notificationCount)
            .fill(0)
            .map((i) => (
              <NotificationCard key={i} />
            ))}
        </MenuGroup>
      </div>
    </Menu>
  );
};

const NotificationCard = () => {
  return (
    <MenuItem className={"inline-flex w-full items-start gap-2 !px-5 !py-4"}>
      <Avatar
        colorStyles={{ bgColor: "P400", textColor: "N0" }}
        size={"md"}
        fullname="Ndubuisi Obinna"
      />
      <div className="flex flex-1 flex-col gap-2">
        <MessageFormatter />
        <Typography variant="p-s" color="N50">
          2hrs ago | EPA
        </Typography>
      </div>
    </MenuItem>
  );
};

const MessageFormatter = () => {
  return (
    <Typography variant="span" className="w-auto text-p-m" fontWeight="bold">
      Ositadinma Nwangwu{" "}
      <Typography variant="span">has approved your review of</Typography> Agonsi
      Onyedikachi <Typography variant="span">for</Typography>{" "}
      <Typography variant="span" color="B400" className="hover:text-underline">
        Review name
      </Typography>
    </Typography>
  );
};
