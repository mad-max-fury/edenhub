"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExitMenuIcon,
  HamburgerIcon,
  ResourceEdgeMobileLogo,
  ResourceEdgeWebLogo,
} from "@/assets/svgs";
import { Button } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative h-[10vh] w-full px-[9.75rem] py-[1rem] mmd:h-auto mmd:px-[1.5rem]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        <div className="flex items-center justify-between gap-8">
          <div className="block mmd:hidden">
            <ResourceEdgeWebLogo />
          </div>
          <div className="hidden mmd:block">
            <ResourceEdgeMobileLogo />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="block">
            <Link href={AuthRouteConfig.LOGIN}>
              <Button variant="primary">Sign in</Button>
            </Link>
          </div>
          {/* <div className="hidden mmd:block">
            <button className="" onClick={toggleMenu}>
              {!isMenuOpen ? <HamburgerIcon /> : <ExitMenuIcon />}
            </button>
          </div> */}
        </div>

        {/* {isMenuOpen && (
          <div className="fixed left-0 top-0 z-50 flex h-[25rem] w-full flex-col items-center justify-center bg-N0 bg-opacity-75 px-3">
            <button
              onClick={toggleMenu}
              className="absolute right-4 top-4 text-2xl text-white"
            >
              <ExitMenuIcon />
            </button>
            <Link href={AuthRouteConfig.LOGIN}>
              <Button
                variant="primary"
                className="flex w-full items-center justify-center"
              >
                Sign in
              </Button>
            </Link>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navigation;
