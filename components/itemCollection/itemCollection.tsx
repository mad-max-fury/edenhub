import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Typography } from "../typography";
import { BsArrowUpRightCircle } from "react-icons/bs";

interface ItemCollectionProps {
	imageURL: string | StaticImageData;
	title: string;
	price: string;
	category?: string;
	href?: string;
}

export const ItemCollection = ({
	imageURL,
	title,
	price,
	category = "Watches",
	href = "#",
}: ItemCollectionProps) => {
	return (
		<Link href={href} className="max-w-80 h-[30rem] flex flex-col group">
			<div className="relative overflow-hidden w-full h-[30rem]">
				<Image
					src={imageURL}
					alt={title}
					priority
					className="group-hover:scale-105 transition-transform duration-300 w-full h-full object-center"
				/>
			</div>
			<div className="mt-3 mx-2 flex flex-col gap-1">
				<Typography
					fontWeight={"bold"}
					color={"N700"}
					className="text-sm font-medium"
				>
					${price}
				</Typography>
				<div className="flex items-center justify-between">
					<Typography
						fontWeight={"bold"}
						color={"N500"}
						className="text-sm font-normal"
					>
						{title}
					</Typography>
					<BsArrowUpRightCircle className="text-lg font-normal group-hover:text-primary" />
				</div>
				<Typography
					fontWeight={"bold"}
					color={"N500"}
					className="text-xs font-normal capitalize"
				>
					{category}
				</Typography>
			</div>
		</Link>
	);
};
