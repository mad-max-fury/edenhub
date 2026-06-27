"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { GlobalMenu } from "../globalMenu/globalMenu";
import { Typography } from "../typography";

export interface HeroSlide {
	image: string | StaticImageData;
	eyebrow?: string;
	title: string;
	subtitle: string;
	primary: { label: string; href: string };
	secondary?: { label: string; href: string };
}

const srcOf = (img: string | StaticImageData) =>
	typeof img === "string" ? img : img.src;

const ctaBase =
	"uppercase tracking-[2px] text-xs font-medium px-8 py-4 transition-colors";

const arrowCls =
	"absolute top-1/2 -translate-y-1/2 z-20 grid place-items-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100";

const SecondaryCta = ({ href, label }: { href: string; label: string }) => {
	const cls = `${ctaBase} border border-white text-white hover:bg-white/10`;
	return href.startsWith("#") ? (
		<a href={href} className={cls}>
			{label}
		</a>
	) : (
		<Link href={href} className={cls}>
			{label}
		</Link>
	);
};

export const HeroCarousel = ({
	slides,
	interval = 6000,
}: {
	slides: HeroSlide[];
	interval?: number;
}) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
		Autoplay({
			delay: interval,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
		}),
	]);
	const [selected, setSelected] = useState(0);
	const count = slides.length;

	const onSelect = useCallback(() => {
		if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi, onSelect]);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
	const scrollTo = useCallback(
		(i: number) => emblaApi?.scrollTo(i),
		[emblaApi],
	);

	return (
		<section className="group relative w-full min-h-[640px] h-screen max-h-[880px]">
			{/* Embla viewport */}
			<div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
				<div className="flex h-full">
					{slides.map((s, i) => (
						<div
							key={i}
							className="relative flex-[0_0_100%] min-w-0 h-full"
						>
							<div
								className="absolute inset-0 bg-cover bg-center"
								style={{ backgroundImage: `url(${srcOf(s.image)})` }}
							/>
							<div className="absolute inset-0 bg-black/30" />
							<div className="absolute inset-0 flex items-center justify-center px-4">
								<div className="flex flex-col justify-center items-center gap-6 max-w-[42rem]">
									{s.eyebrow && (
										<Typography
											fontWeight="medium"
											color="LB200"
											className="uppercase tracking-[4px] text-xs text-center"
										>
											{s.eyebrow}
										</Typography>
									)}
									<Typography
										variant="h-xxl"
										fontWeight="medium"
										customClassName="text-[#FEFEFC] text-center leading-[112%]"
									>
										{s.title}
									</Typography>
									<Typography
										variant="p-xl"
										customClassName="text-[#FEFEFC]/90 text-center leading-[34px]"
									>
										{s.subtitle}
									</Typography>
									<div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
										<Link
											href={s.primary.href}
											className={`${ctaBase} bg-white text-BR500 hover:bg-LB50`}
										>
											{s.primary.label}
										</Link>
										{s.secondary && (
											<SecondaryCta
												href={s.secondary.href}
												label={s.secondary.label}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Nav overlays the slides */}
			<div className="relative z-20">
				<GlobalMenu />
			</div>

			{count > 1 && (
				<>
					<button
						type="button"
						aria-label="Previous slide"
						onClick={scrollPrev}
						className={`${arrowCls} left-3 lg:left-6`}
					>
						<ChevronLeft size={20} />
					</button>
					<button
						type="button"
						aria-label="Next slide"
						onClick={scrollNext}
						className={`${arrowCls} right-3 lg:right-6`}
					>
						<ChevronRight size={20} />
					</button>

					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
						{slides.map((_, i) => (
							<button
								key={i}
								type="button"
								aria-label={`Go to slide ${i + 1}`}
								aria-current={i === selected}
								onClick={() => scrollTo(i)}
								className={`h-2 rounded-full transition-all duration-300 ${
									i === selected
										? "w-6 bg-white"
										: "w-2 bg-white/50 hover:bg-white/80"
								}`}
							/>
						))}
					</div>
				</>
			)}
		</section>
	);
};
