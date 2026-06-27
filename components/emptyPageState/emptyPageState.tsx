"use client";

import Image from "next/image";

import { Typography } from "../typography";

interface IEmptyProps {
	imgSrc?: string;
	icon?: React.ReactNode;
	title?: string;
	text?: string;
	buttonGroup?: React.ReactElement;
	containerClassname?: string;
}

export const EmptyPageState: React.FC<IEmptyProps> = ({
	title,
	text,
	buttonGroup,
	imgSrc,
	icon,
	containerClassname,
}) => {
	return (
		<div className={containerClassname}>
			{imgSrc ? (
				<div className="w-fit">
					<Image src={imgSrc} alt={(title as string) || (text as string)} />
				</div>
			) : (
				<div className="w-fit">{icon}</div>
			)}
			{title && (
				<div className="max-w-[370px]">
					<Typography
						variant={"c-xxl"}
						color="N800"
						className="mb-6 text-center"
						fontWeight="bold"
					>
						{title}
					</Typography>
				</div>
			)}
			{text && (
				<div className="max-w-[340px]">
					<Typography variant="p-m" className="text-center">
						{text}
					</Typography>
				</div>
			)}
			{buttonGroup}
		</div>
	);
};
