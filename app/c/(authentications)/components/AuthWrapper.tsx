"use client";

import { GoogleIcon } from "@/assets/svgs";
import { Button, Typography } from "@/components";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
	children: React.ReactNode;
	title: string;
	description: string;
	hideFooter?: boolean;
	hideAuthOptions?: boolean;
	linkText?: string;
	linkSubText?: string;
	linkHref?: string;
	icon?: React.ReactNode;
};

const AuthWrapper = ({
	children,
	title,
	description,
	hideFooter = false,
	linkText = `Don’t have an account?`,
	linkSubText = `Sign up`,
	linkHref = `/c/sign-up`,
	hideAuthOptions = false,
	icon,
}: Props) => {
	return (
		<div className="w-full py-[41px] px-[clamp(16px,3vw,40px)] max-w-[613px] bg-white shadow-auth  mx-auto rounded-md ">
			<header className="flex items-center justify-center flex-col">
				{icon && icon}
				<Typography
					variant={"h-l"}
					fontWeight={"medium"}
					color={"gray-darker"}
					className="mb-4"
				>
					{title}
				</Typography>
				<Typography
					variant={"p-m"}
					color={"gray-normal"}
					className="mb-4 max-w-[400px] text-center"
				>
					{description}
				</Typography>
			</header>
			<div className=" mx-auto w-full ">{children}</div>
			{!hideFooter && (
				<div className="flex flex-col items-center w-full justify-center mx-auto gap-4">
					{!hideAuthOptions && (
						<>
							<div className="w-full flex items-center mb-5 gap-[18px]">
								<hr className="flex-1 h-[1px]" />
								<span> Or</span>
								<hr className="flex-1 h-[1px]" />
							</div>
							<Button variant={"brown"} types={"outline"} className="w-full group">
								<div className="flex text-base items-center gap-4 ">
									<GoogleIcon className={`[&>path]:group-hover:fill-white`} />{" "}
									<small>Continue with Google</small>
								</div>
							</Button>
						</>
					)}
					<Typography
						color="gray-normal"
						variant="p-m"
						className="text-center mt-6 flex gap-1 items-center justify-center"
					>
						{linkText}{" "}
						<Link href={linkHref} className="hover:underline">
							<Typography fontWeight="medium" color={"BR400"}>
								{linkSubText}
							</Typography>
						</Link>
					</Typography>
				</div>
			)}
		</div>
	);
};

export default AuthWrapper;
