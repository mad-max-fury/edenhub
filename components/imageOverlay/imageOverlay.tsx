import Image from "next/image";
import { noImage } from "@/assets/images";
import { Typography } from "../typography";
import { StaticImageData } from "next/image";

interface ImageOverlayProps {
	imageURL?: string | StaticImageData; // making this required later
	mainText?: string;
	subText?: string;
}

export const ImageOverlay = ({
	imageURL,
	mainText = "MAN",
	subText = "NEW ARRIVAL",
}: ImageOverlayProps) => {
	return (
		<div className="relative w-full h-[18.75rem] aspect-square overflow-hidden">
			<div className="absolute inset-0">
				<Image
					src={imageURL || noImage}
					alt="Overlay Image"
					fill
					className="object-cover w-full h-full"
					priority
				/>
			</div>
			<div className="absolute inset-0 bg-black bg-opacity-60 z-20" />
			<div className="absolute inset-0 flex flex-col gap-y-2 items-center justify-center z-20">
				<Typography
					fontWeight="medium"
					align="center"
					className="text-white text-5xl lg:text-6xl xl:text-7xl"
				>
					{mainText}
				</Typography>
				<Typography
					fontWeight="regular"
					align="center"
					className="text-white text-xs lg:text-p-m"
				>
					{subText}
				</Typography>
			</div>
		</div>
	);
};
