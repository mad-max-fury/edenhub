import { BadgeCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Typography } from "../typography";

const ITEMS = [
	{
		icon: ShieldCheck,
		title: "2-Year Warranty",
		subtitle: "On every timepiece",
	},
	{
		icon: Truck,
		title: "Free Nationwide Shipping",
		subtitle: "On orders over ₦150,000",
	},
	{
		icon: BadgeCheck,
		title: "Authenticity Guaranteed",
		subtitle: "Individually numbered",
	},
	{
		icon: RotateCcw,
		title: "30-Day Returns",
		subtitle: "Hassle-free exchanges",
	},
];

export const AssuranceStrip = () => {
	return (
		<section className="bg-default border-y border-[#E6E0CF]">
			<div className="max-w-screen-2xl mx-auto grid grid-cols-2 lg:grid-cols-4">
				{ITEMS.map((item, i) => (
					<div
						key={item.title}
						className={`flex items-center gap-3 px-5 py-6 lg:px-8 ${
							i !== 0 ? "lg:border-l border-[#E6E0CF]" : ""
						}`}
					>
						<item.icon
							className="text-LB500 shrink-0"
							size={26}
							strokeWidth={1.5}
						/>
						<div className="flex flex-col">
							<Typography
								fontWeight="medium"
								color="BR500"
								className="text-xs lg:text-sm leading-tight"
							>
								{item.title}
							</Typography>
							<Typography color="gray-normal" className="text-[11px] lg:text-xs">
								{item.subtitle}
							</Typography>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
