import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Typography } from "../typography";

export interface CategoryTileItem {
	name: string;
	slug: string;
	image: string | StaticImageData;
	href?: string;
}

export const CategoryTiles = ({ items }: { items: CategoryTileItem[] }) => {
	if (!items.length) return null;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
			{items.map((item) => (
				<Link
					key={item.slug}
					href={item.href ?? `/shop?category=${item.slug}`}
					className="group relative overflow-hidden aspect-[3/4] bg-N20"
				>
					<Image
						src={item.image}
						alt={item.name}
						fill
						sizes="(max-width: 768px) 50vw, 25vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/50" />
					<div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 flex flex-col gap-1.5">
						<Typography
							fontWeight="medium"
							className="text-white text-lg lg:text-xl uppercase tracking-wide leading-tight"
						>
							{item.name}
						</Typography>
						<span className="flex items-center gap-1.5 text-white/90 text-[11px] tracking-[2px] uppercase">
							Shop
							<ArrowRight
								size={14}
								className="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</span>
					</div>
				</Link>
			))}
		</div>
	);
};
