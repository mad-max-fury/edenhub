"use client";

import { useCallback, useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { TestimonialCard } from "../testimonialCard/TestimonialCard";

export interface TestimonialItem {
  id: string;
  name: string;
  comment: string;
  image: string | StaticImageData;
  rating?: number;
}

const arrowCls =
  "absolute top-1/2 -translate-y-1/2 z-20 grid place-items-center w-10 h-10 rounded-full bg-BR100 text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 enabled:hover:bg-BR400 disabled:opacity-0 disabled:cursor-default";

export const TestimonialsCarousel = ({
  items,
}: {
  items: TestimonialItem[];
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
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

  return (
    <div className="group relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex-[0_0_85%] sm:flex-[0_0_60%] lg:flex-[0_0_31.5%] min-w-0"
            >
              <TestimonialCard
                image={t.image}
                name={t.name}
                comment={t.comment}
                rating={t.rating}
              />
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className={`${arrowCls} left-2 lg:-left-3`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className={`${arrowCls} right-2 lg:-right-3`}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
};
