"use client";

import {
  heroImg,
  largeWatch,
  NewArrivalMan,
  NewArrivalWomen,
  testimonial1,
  testimonial2,
  testimonial3,
  watch3,
  watch5,
  watch7,
} from "@/assets/images";
import {
  AssuranceStrip,
  Button,
  CategoryTiles,
  EditorialFeature,
  EmptyPageState,
  Footer,
  HeroCarousel,
  LandingTab,
  ShopReviewForm,
  TestimonialsCarousel,
  Typography,
  WatchShowcase,
  notify,
  type CategoryTileItem,
  type HeroSlide,
} from "@/components";
import type { TypographyColors } from "@/components/typography/types";
import AccordionWrapper from "@/components/accordions/AccordionWrapper";
import { ShopProductCard } from "@/app/shop/components/shopProductCard";
import {
  useGetBestSellersQuery,
  useGetCatalogProductsQuery,
} from "@/redux/api/catalog";
import { useGetActiveAdsQuery } from "@/redux/api/ads";
import { useGetPublicFaqsQuery } from "@/redux/api/faqs";
import { useGetShopReviewsQuery } from "@/redux/api/shopReviews";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const HERO_SLIDES: HeroSlide[] = [
  {
    image: heroImg,
    eyebrow: "Timeless by design",
    title: "Timeless Elegance, Crafted Just for You",
    subtitle:
      "Discover luxury timepieces and personalized accessories that redefine sophistication. Customize your watch to match your unique style.",
    primary: { label: "Start Shopping", href: "/shop" },
    secondary: { label: "Design Your Own", href: "#customize" },
  },
  {
    image: largeWatch,
    eyebrow: "The Heritage Collection",
    title: "Engineered to Outlast Trends",
    subtitle:
      "Hand-finished, individually numbered timepieces built from the finest materials — made to be worn for generations.",
    primary: { label: "Shop Watches", href: "/shop" },
    secondary: { label: "Our Story", href: "/shop" },
  },
  {
    image: watch7,
    eyebrow: "Made yours",
    title: "Design a Watch That's Unmistakably You",
    subtitle:
      "Choose the case, dial, strap and engraving. Craft a one-of-one timepiece as individual as you are.",
    primary: { label: "Start Customizing", href: "#customize" },
    secondary: { label: "Browse Collection", href: "/shop" },
  },
];

const CATEGORY_TILES: CategoryTileItem[] = [
  {
    name: "Men",
    slug: "men",
    image: NewArrivalMan,
    href: "/shop?audience=men",
  },
  {
    name: "Women",
    slug: "women",
    image: NewArrivalWomen,
    href: "/shop?audience=women",
  },
  {
    name: "Unisex",
    slug: "unisex",
    image: watch3,
    href: "/shop?audience=unisex",
  },
];

const SectionHeading = ({
  eyebrow,
  title,
  action,
  eyebrowColor = "LB500",
  titleColor = "BR500",
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  eyebrowColor?: TypographyColors;
  titleColor?: TypographyColors;
}) => (
  <div className="flex items-end justify-between gap-4 flex-wrap">
    <div className="flex flex-col gap-2">
      {eyebrow && (
        <Typography
          fontWeight="medium"
          color={eyebrowColor}
          className="uppercase tracking-[1px] text-xs"
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        fontWeight="medium"
        color={titleColor}
        className="text-3xl lg:text-4xl capitalize "
      >
        {title}
      </Typography>
    </div>
    {action}
  </div>
);

const ViewAll = ({ children }: { children: React.ReactNode }) => (
  <Link
    href="/shop"
    className="flex font-clashDisplay  items-center gap-1.5 text-sm text-BR500 hover:text-BR400 transition-colors uppercase tracking-[1px]"
  >
    {children}
    <ArrowRight size={15} />
  </Link>
);

export default function Home() {
  const router = useRouter();

  const { data: adsRes } = useGetActiveAdsQuery({ placement: "hero" });
  const heroAds = adsRes?.data ?? [];
  const heroSlides: HeroSlide[] = heroAds.length
    ? heroAds.map((ad) => ({
        image: ad.image || heroImg,
        eyebrow: ad.eyebrow,
        title: ad.title,
        subtitle: ad.subtitle || ad.description || "",
        primary: {
          label: ad.ctaText || "Shop Now",
          href: ad.ctaLink || `/shop?ad=${ad._id}`,
        },
        secondary: { label: "Browse Collection", href: "/shop" },
      }))
    : HERO_SLIDES;

  const { data: bestRes, isFetching: bestLoading } = useGetBestSellersQuery({
    limit: 6,
  });
  const bestSellers = bestRes?.data ?? [];

  const { data: newRes, isFetching: newLoading } = useGetCatalogProductsQuery({
    pageSize: 8,
    sort: "newest",
  });
  const newArrivals = newRes?.data.data ?? [];

  const { data: reviewsRes } = useGetShopReviewsQuery({ limit: 12 });
  const reviews = reviewsRes?.data ?? [];
  const fallbackAvatars = [testimonial1, testimonial2, testimonial3];
  const testimonialItems =
    reviews?.map((r, i) => ({
      id: r._id,
      name: r.name,
      comment: r.comment,
      rating: r.rating,
      image: r.image || fallbackAvatars[i % fallbackAvatars.length],
    })) || [];

  const { data: faqsRes } = useGetPublicFaqsQuery();
  const apiFaqs = faqsRes?.data ?? [];
  const faqList =
    apiFaqs?.map((f) => ({
      id: f._id,
      question: f.question,
      answer: f.answer,
      category: f.category || "general",
    })) || [];

  const faqCategories = Array.from(new Set(faqList.map((f) => f.category)));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeFaqCat, setActiveFaqCat] = useState("");
  const effectiveFaqCat = activeFaqCat || faqCategories[0] || "general";
  const visibleFaqs = faqList.filter((f) => f.category === effectiveFaqCat);
  const [openFaqId, setOpenFaqId] = useState("");

  interface ISubscribeNowPayload {
    email: string;
  }
  const subscribeNowSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  const { register, handleSubmit, reset } = useForm<ISubscribeNowPayload>({
    resolver: yupResolver(subscribeNowSchema),
  });

  const onSubmit = (formData: ISubscribeNowPayload) => {
    notify.success({
      message: "You're on the list!",
      subtitle: `We'll send updates to ${formData.email}`,
    });
    reset();
  };

  const ProductGrid = ({
    loading,
    products,
    gridClass,
    skeleton = 8,
  }: {
    loading: boolean;
    products: typeof bestSellers;
    gridClass: string;
    skeleton?: number;
  }) =>
    loading ? (
      <div className={gridClass}>
        {Array.from({ length: skeleton }).map((_, i) => (
          <div key={i} className="w-full aspect-[4/5] bg-N20 animate-pulse" />
        ))}
      </div>
    ) : products.length !== 0 ? (
      <div className={gridClass}>
        {products.map((product) => (
          <ShopProductCard
            key={product._id}
            product={product}
            variant="minimal"
          />
        ))}
      </div>
    ) : (
      <EmptyPageState
        title="Nothing to Display"
        text="No Product Found"
        containerClassname="flex flex-col items-center justify-center h-52"
      />
    );

  const gridFour =
    "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-3";
  const gridThree = "grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-5";

  return (
    <main className="w-full max-w-[1440px] mx-auto">
      <HeroCarousel slides={heroSlides} />
      {/* <AssuranceStrip /> */}
      <section className="py-16 px-4 lg:px-10 bg-N0 flex flex-col gap-10">
        <SectionHeading
          eyebrow="Find your fit"
          title="Shop by Category"
          action={<ViewAll>View marketplace</ViewAll>}
        />
        <CategoryTiles items={CATEGORY_TILES} />
      </section>
      <section className="py-16 px-4 lg:px-10 bg-LB50 flex flex-col gap-10">
        <SectionHeading
          eyebrow="Loved by our customers"
          title="Best Sellers"
          action={<ViewAll>View marketplace</ViewAll>}
        />
        <ProductGrid
          loading={bestLoading}
          products={bestSellers}
          gridClass={gridThree}
          skeleton={6}
        />
      </section>

      <section id="customize" className="scroll-mt-20">
        <WatchShowcase
          title="Own a Watch That Defines You"
          subtitle="Create a luxury timepiece tailored to your style. Craftsmanship, prestige, and personalization—all in one watch."
          backgroundImage={largeWatch}
          buttonText="START CUSTOMIZING"
          onButtonClick={() => router.push("/shop")}
        />
      </section>

      <section className="py-16 px-4 lg:px-10 bg-N0 flex flex-col gap-10">
        <SectionHeading
          eyebrow="Fresh off the bench"
          title="New Arrivals"
          action={<ViewAll>View all</ViewAll>}
        />
        <ProductGrid
          loading={newLoading}
          products={newArrivals}
          gridClass={gridFour}
        />
      </section>

      <EditorialFeature
        eyebrow="The Heritage Collection"
        title="Crafted to be Worn for Generations"
        body="We craft timeless, high-quality timepieces and accessories that reflect individuality, elegance, and precision. Every piece is numbered, hand-finished, and built to tell a story that outlasts trends."
        ctaText="Discover the craft"
        ctaHref="/shop"
        image={watch5}
        reverse
      />

      {testimonialItems.length > 0 && (
        <section className="bg-N10 px-4 lg:px-10 py-16 flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-N400 uppercase tracking-widest mb-1">
                In their words
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-N900">
                What Our Clients Say
              </h2>
            </div>
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-sm text-BR500 hover:text-BR400 font-medium shrink-0"
            >
              Write a review
            </button>
          </div>
          <TestimonialsCarousel items={testimonialItems} />
          <ShopReviewForm
            open={showReviewForm}
            onClose={() => setShowReviewForm(false)}
          />
        </section>
      )}

      <section className="py-16 lg:px-20 flex flex-col items-center gap-8 lg:gap-12 bg-N0">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-center items-center gap-5">
            <Typography
              fontWeight="medium"
              color="BR500"
              className="capitalize text-3xl md:!text-5xl text-center leading-[100%]"
            >
              FAQs
            </Typography>
            <Typography
              variant="p-xl"
              color="BR400"
              className="leading-[26px] tracking-[-1%] text-center w-11/12 lg:w-3/5"
            >
              Find everything you need to know about ordering, customization,
              shipping, returns, and more. If you need further assistance, our
              team is here to help
            </Typography>
          </div>

          {faqCategories.length > 1 && (
            <div className="flex items-center justify-center gap-[10px] flex-wrap">
              {faqCategories.map((cat) => (
                <LandingTab
                  key={cat}
                  name={cat}
                  isActiveTab={cat === effectiveFaqCat}
                  onClick={() => setActiveFaqCat(cat)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center px-4 w-11/12 lg:w-3/5">
          {visibleFaqs.map((item) => (
            <AccordionWrapper
              key={item.id}
              title={item.question}
              isOpen={item.id === openFaqId}
              toggleAccordion={() =>
                setOpenFaqId((id) => (id === item.id ? "" : item.id))
              }
            >
              <Typography
                variant="p-l"
                className="leading-[31px] text-BR500 lg:w-4/5"
              >
                {item.answer}
              </Typography>
            </AccordionWrapper>
          ))}
        </div>
      </section>

      <section className="bg-LB50 flex flex-col items-center justify-center gap-6 py-16 px-4">
        <Typography
          fontWeight="medium"
          color="BR500"
          className="capitalize text-3xl md:!text-5xl text-center leading-[100%]"
        >
          Stay Timeless. <br />
          Stay Exclusive.
        </Typography>

        <Typography
          variant="p-xl"
          color="BR400"
          className="leading-[26px] text-center w-11/12 lg:w-3/5"
        >
          Join our VIP list for early access to new collections, exclusive
          discounts, and behind-the-scenes craftsmanship stories. Plus, enjoy
          10% off your first order!
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 w-11/12 lg:w-3/5 max-w-[638px]"
        >
          <input
            type="email"
            id="email"
            placeholder="Input your email address"
            className="md:w-[70%] border border-[#D8D8D8] py-4 px-7 bg-transparent placeholder:text-[#606060] focus:outline-none focus:border-BR400"
            {...register("email")}
          />
          <Button
            type="submit"
            variant="brown"
            shape="none"
            className="md:w-[30%] uppercase py-5"
          >
            subscribe now
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
