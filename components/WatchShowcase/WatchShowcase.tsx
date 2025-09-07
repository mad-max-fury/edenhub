import Image, { StaticImageData } from "next/image";
import { Typography } from "../typography";
import { Button } from "../buttons";

interface HeroSectionProps {
	title: string;
	subtitle: string;
	buttonText?: string;
	backgroundImage: string | StaticImageData;
	onButtonClick?: () => void;
}

export const WatchShowcase: React.FC<HeroSectionProps> = ({
	title,
	subtitle,
	buttonText,
	backgroundImage,
	onButtonClick,
}) => {
	return (
		<div className="relative w-full min-h-[300px] lg:min-h-[500px] bg-cover bg-center flex items-center justify-center">
			<Image
				src={backgroundImage}
				alt="WatchShowcase"
				fill
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-black/60"></div>

			<div className="relative flex flex-col justify-center items-center text-white px-4 max-w-3xl space-y-5">
				<Typography
					variant="h-l"
					fontWeight={"medium"}
					color="N0"
					align="center"
					className="text-N0"
				>
					{title}
				</Typography>
				<Typography color={"N0"} className="text-center text-sm md:text-xl">
					{subtitle}
				</Typography>

				{buttonText && (
					<Button
						variant="secondary"
						types="outline"
						className="text-N0 md:max-w-42 py-5 rounded-none text-base"
						onClick={onButtonClick}
					>
						{buttonText}
					</Button>
				)}
			</div>
		</div>
	);
};
