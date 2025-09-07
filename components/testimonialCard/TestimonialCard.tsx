import Image, { StaticImageData } from "next/image";
import { Typography } from "../typography";

interface TestimonialCardProps {
	image: string | StaticImageData;
	name: string;
	comment: string;
}

export const TestimonialCard = ({
	image,
	name,
	comment,
}: TestimonialCardProps) => {
	return (
		<div className="my-9 py-9 px-5 border border-[#D8D8D8] flex flex-col justify-between relative gap-4 lg:h-[331px]">
			<Image
				src={image}
				alt={`${name} picture`}
				className="size-[92px] absolute -top-16 left-6"
			/>

			<Typography className="mt-12 leading-[26px]">{`“${comment}”`}</Typography>

			<Typography className="uppercase text-gray-normal" fontWeight="medium">
				{name}
			</Typography>
		</div>
	);
};
