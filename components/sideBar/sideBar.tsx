"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { CloseXIcon, HamburgerIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import { Drawer } from "../drawer/drawer";
import { Typography } from "../typography";
import { Button } from "../buttons";
import { CONTACT_ITEMS, MENU_ITEMS } from "@/constants/data";

interface MenuItem {
  title: string;
  path: string;
}

interface ContactItem {
  title: string;
  value: string;
  link: string;
}

const NavLinkBtn: React.FC<MenuItem> = ({ title, path }) => (
  <Link
    href={path}
    className={cn(
      "rounded-[2px] p-[8px_12px] w-fit relative text-N900 transition-all duration-[0.5s] ease-in-out after:content-[''] after:w-0 after:absolute after:top-full after:transition-all after:duration-300 after:ease-in-out after:h-[5px] after:bg-card hover:text-BR300 [&:hover]:after:w-[80%] [&:hover]:after:translate-x-[20%]"
    )}
  >
    <Typography
      variant="h-xxl"
      fontWeight="medium"
      color="text-default"
      className="text-[inherit] transition-all duration-300 ease-in-out"
    >
      {title}
    </Typography>
  </Link>
);

const ContactLink: React.FC<ContactItem> = ({ title, link, value }) => (
  <div className="flex flex-col gap-2">
    <Typography
      variant="h-s"
      fontWeight="medium"
      color="text-default"
      className="text-[inherit] transition-all duration-300 ease-in-out"
    >
      {title}
    </Typography>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      <Typography
        variant="p-m"
        fontWeight="medium"
        color="LB600"
        className="text-[inherit] transition-all duration-300 ease-in-out"
      >
        {value}
      </Typography>
    </a>
  </div>
);

export const SideBar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <>
      <Button
        shape="pill"
        variant="gold"
        size="plain"
        onClick={handleOpenDrawer}
        className="aspect-square h-[50px]"
      >
        <HamburgerIcon />
      </Button>

      <Drawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        anchor="left"
        selector="drawer-root"
        width="797px"
        header={
          <div className="flex items-center justify-end gap-1">
            <CloseXIcon
              onClick={handleCloseDrawer}
              className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-[.9] hover:opacity-90"
            />
          </div>
        }
      >
        <div className="flex h-full w-full flex-col max-w-[455px]">
          <div className="mt-4 flex flex-1 overflow-auto hideScrollBar w-full flex-col gap-12">
            {MENU_ITEMS.map((item) => (
              <NavLinkBtn key={item.title} {...item} />
            ))}
          </div>

          <div className="flex items-center justify-between  flex-wrap">
            {CONTACT_ITEMS.map((item) => (
              <ContactLink key={item.title} {...item} />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
};
