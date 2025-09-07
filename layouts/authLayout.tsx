"use client";

import { type ReactNode } from "react";
import { Typography } from "@/components";
import { appraisalAppUrl } from "@/config";

interface LayoutProps {
	children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<main className="relative flex h-screen w-screen items-center justify-center">
			<div className="relative z-10">
				{children}

				<Typography
					variant="p-xl"
					fontWeight="regular"
					color="N500"
					className="mt-10 text-center"
				>
					Need to access the appraisal system?{" "}
					<a href={appraisalAppUrl} className="text-B400 hover:underline">
						Click here
					</a>
				</Typography>
			</div>
		</main>
	);
};

export default AuthLayout;
