"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";
import { AppLogo } from "../logo/logo";
import { UserDropDown } from "../userDropDown/userDropDown";
import { SideBar } from "../sideBar/sideBar";
import { Button } from "../buttons";
import { CartIcon } from "@/assets/svgs";
import { GlobalSearchDropdown } from "../globalSearch/globalSearch";

const pathToMatch = "/";

export const GlobalMenu = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		handleScroll();

		if (pathname === pathToMatch) {
			window.addEventListener("scroll", handleScroll);
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		} else {
			setIsScrolled(false);
		}
	}, [pathname]);

	return (
		<>
			<nav
				className={cn(
					"sticky left-0 right-0 top-0 isolate z-30 flex items-center justify-between px-[clamp(12px,_3vw,_24px)] transition-colors duration-300 ease-in-out py-5",
					pathname === pathToMatch && (isScrolled ? "bg-N0" : "bg-transparent"),
					pathname !== pathToMatch && "bg-N0"
				)}
			>
				<div className="flex items-center z-[1] justify-between mx-auto w-full max-w-screen-2xl">
					<SideBar />

					<AppLogo
						responsive
						size={"lg"}
						variant={
							pathname !== pathToMatch
								? "textHorizontalBlack"
								: isScrolled && pathname === pathToMatch
									? "textHorizontalBlack"
									: "textHorizontalWhite"
						}
					/>

					<div className="z-[-1] isolate flex items-center gap-2">
						<GlobalSearchDropdown />
						<UserDropDown />
						<Button
							shape={"pill"}
							variant={"gold"}
							size={"plain"}
							className={"aspect-square h-[50px]"}
						>
							<CartIcon />
						</Button>
					</div>
				</div>
			</nav>
		</>
	);
};
