import Image, { StaticImageData } from "next/image";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
	image: string | StaticImageData;
	name: string;
	comment: string;
	rating?: number;
}

export const TestimonialCard = ({
	image,
	name,
	comment,
	rating = 5,
}: TestimonialCardProps) => {
	const rounded = Math.round(rating);
	return (
		<div className="bg-white rounded-lg p-6 flex flex-col gap-4 h-full">
			<div className="flex items-center gap-3">
				<Image
					src={image}
					alt={`${name}`}
					width={44}
					height={44}
					className="w-11 h-11 rounded-full object-cover shrink-0"
				/>
				<div className="min-w-0">
					<p className="text-sm font-medium text-N900 truncate">{name}</p>
					<span className="flex items-center gap-0.5 mt-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} size={12} className={i < rounded ? "fill-amber-400 text-amber-400" : "text-N200"} />
						))}
					</span>
				</div>
			</div>
			<p className="text-sm text-N600 leading-relaxed flex-1">&ldquo;{comment}&rdquo;</p>
		</div>
	);
};
