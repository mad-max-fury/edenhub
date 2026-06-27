import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Typography } from "../typography";

interface EditorialFeatureProps {
	eyebrow: string;
	title: string;
	body: string;
	ctaText: string;
	ctaHref: string;
	image: string | StaticImageData;
	/** Place the image on the right instead of the left (desktop). */
	reverse?: boolean;
}

export const EditorialFeature = ({
	eyebrow,
	title,
	body,
	ctaText,
	ctaHref,
	image,
	reverse = false,
}: EditorialFeatureProps) => {
	return (
		<section className="grid md:grid-cols-2 items-stretch">
			<div
				className={`relative min-h-[320px] md:min-h-[460px] lg:min-h-[560px] bg-N20 ${
					reverse ? "md:order-2" : "md:order-1"
				}`}
			>
				<Image
					src={image}
					alt={title}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
			</div>

			<div
				className={`flex flex-col justify-center gap-5 px-6 sm:px-10 lg:px-16 py-14 lg:py-20 bg-LB50 ${
					reverse ? "md:order-1" : "md:order-2"
				}`}
			>
				<Typography
					fontWeight="medium"
					color="LB500"
					className="uppercase tracking-[3px] text-xs"
				>
					{eyebrow}
				</Typography>
				<Typography
					fontWeight="medium"
					color="BR500"
					className="text-3xl lg:text-5xl leading-[1.1]"
				>
					{title}
				</Typography>
				<Typography color="BR400" className="leading-[28px] max-w-md">
					{body}
				</Typography>
				<Link
					href={ctaHref}
					className="mt-2 inline-flex items-center gap-2 self-start uppercase tracking-[2px] text-xs font-medium px-8 py-4 bg-BR500 text-white hover:bg-BR400 transition-colors"
				>
					{ctaText}
					<ArrowRight size={16} />
				</Link>
			</div>
		</section>
	);
};
