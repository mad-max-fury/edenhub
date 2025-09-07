"use client";

import {
	heroImg,
	largeWatch,
	NewArrivalMan,
	NewArrivalWomen,
} from "@/assets/images";
import { GoldLogoIcon } from "@/assets/svgs";
import {
	Button,
	EmptyPageState,
	Footer,
	GlobalMenu,
	ImageOverlay,
	ItemCollection,
	LandingTab,
	TestimonialCard,
	Typography,
	WatchShowcase,
} from "@/components";
import AccordionWrapper from "@/components/accordions/AccordionWrapper";
import {
	LANDING_FAQS,
	LANDING_FEATURED_PRODUCTS,
	LANDING_TESTIMONIALS,
} from "@/constants/data";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type IsActiveTabProps = "watches" | "sunglasses" | "bracelets" | "wallets";

type IsActiveFAQTabProps = "orders" | "payments" | "repairs";

interface TabLinksProps {
	id: number;
	name: IsActiveTabProps;
}

interface FAQTabsProps {
	id: string;
	name: string;
	linkName: IsActiveFAQTabProps;
}

export default function Home() {
	const [isActiveTab, setIsActiveTab] = useState<IsActiveTabProps>("watches");
	const [isActiveFAQTab, setIsActiveFAQTab] =
		useState<IsActiveFAQTabProps>("orders");
	const [isActiveAccordion, setIsActiveAccordion] = useState(0);

	const tabLinks: TabLinksProps[] = [
		{ id: 1, name: "watches" },
		{ id: 2, name: "sunglasses" },
		{ id: 3, name: "bracelets" },
		{ id: 4, name: "wallets" },
	];

	const FAQTabs: FAQTabsProps[] = [
		{ id: "1", name: "Orders & Delivery", linkName: "orders" },
		{ id: "2", name: "Payments & Discounts", linkName: "payments" },
		{ id: "3", name: "Returns, Warranty & Repairs", linkName: "repairs" },
	];

	const filteredProducts = LANDING_FEATURED_PRODUCTS.filter(
		(product) => product.category === isActiveTab
	);

	interface ISubscribeNowPayload {
		email: string;
	}
	const subscribeNowSchema = yup.object().shape({
		email: yup.string().email("Invalid email").required("Email is required"),
	});

	const {
		// register,
		handleSubmit,
		// formState: { errors },
	} = useForm<ISubscribeNowPayload>({
		resolver: yupResolver(subscribeNowSchema),
	});

	const onSubmit = (formData: ISubscribeNowPayload) => {
		console.log("Form data", formData);
	};

	return (
		<main className="w-full max-w-[1440px] mx-auto">
			<section
				className=" bg-cover bg-center h-screen max-h-[1440px] w-full flex flex-col "
				style={{ backgroundImage: `url(${heroImg.src})` }}
			>
				<GlobalMenu />
				<div className="flex items-center justify-center pt-[214px] pb-72">
					<div className="flex flex-col justify-center items-center gap-6 w-[38.75rem]">
						<Typography
							variant="h-xxl"
							fontWeight="medium"
							customClassName="text-[#FEFEFC] text-center leading-[116%]"
						>
							Timeless Elegance, Crafted Just for You
						</Typography>
						<Typography
							variant="p-xl"
							customClassName="text-[#FEFEFC] text-center leading-[40px]"
						>
							Discover luxury timepieces and personalized accessories that redefine
							sophistication. Customize your watch to match your unique style.
						</Typography>
						<Button variant="plain" className="uppercase">
							Start Shopping
						</Button>
					</div>
				</div>
			</section>

			<section className="py-24 bg-LB50 flex flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center gap-6">
					<GoldLogoIcon className="h-[44px] w-[43px]" />
					<Typography
						fontWeight="medium"
						customClassName="text-[#3A3A3A] uppercase text-center text-[1rem] lg:text-[3rem] leading-[40px] lg:leading-[77px] lg:w-[56.25rem]"
					>
						We craft timeless, high-quality timepieces and accessories that reflect
						individuality, elegance, and precision. Every piece tells a story
					</Typography>
					<Typography variant="c-xl" color="gray-normal">
						Your Satisfaction is our priority
					</Typography>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-16 px-4 lg:px-10 bg-[#F5F5F5] flex flex-col gap-10">
				<div className="flex items-center justify-between">
					<Typography
						variant="p-xl"
						fontWeight="medium"
						color="gray-darker"
						className="capitalize !text-xl lg:!text-[4rem] flex-shrink-0"
					>
						featured products
					</Typography>

					<button className="capitalize md:text-xl text-BR500 underline cursor-pointer flex-shrink-0">
						view market place
					</button>
				</div>

				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-3 flex-wrap">
						{tabLinks.map((tab) => {
							return (
								<LandingTab
									name={tab.name}
									isActiveTab={tab.name === isActiveTab}
									onClick={() => setIsActiveTab(tab.name)}
								/>
							);
						})}
					</div>

					{filteredProducts?.length !== 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
							{filteredProducts.map((product) => (
								<ItemCollection
									key={product?.id}
									imageURL={product?.image}
									title={product?.name}
									price={String(product?.price)}
									category={product?.category}
								/>
							))}
						</div>
					) : (
						<EmptyPageState
							title="Nothing to Display"
							text="No Product Found"
							containerClassname="flex flex-col items-center justify-center h-52"
						/>
					)}
				</div>
			</section>

			{/* New arrival */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-5 py-16 px-6 lg:px-40 bg-LB50 justify-items-center">
				<ImageOverlay imageURL={NewArrivalMan} />
				<ImageOverlay imageURL={NewArrivalWomen} mainText="WOMAN" />
			</section>

			<section>
				<WatchShowcase
					title="Own a Watch That Defines You"
					subtitle="Create a luxury timepiece tailored to your style. Craftsmanship, prestige, and personalization—all in one watch."
					backgroundImage={largeWatch}
					buttonText="START CUSTOMIZING"
					// onButtonClick={}
				/>
			</section>

			{/* Testimonials */}
			<section className="bg-LB50 px-4 lg:px-10 py-16 flex flex-col gap-10">
				<Typography
					variant="p-xl"
					fontWeight="medium"
					color="gray-darker"
					className="capitalize text-3xl lg:!text-[4rem] flex-shrink-0"
				>
					testimonials
				</Typography>

				<div className="mt-20 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center gap-20 lg:gap-4">
					{LANDING_TESTIMONIALS.map((testimonial) => (
						<TestimonialCard
							key={testimonial.id}
							image={testimonial.image}
							name={testimonial.name}
							comment={testimonial.comment}
						/>
					))}
				</div>
			</section>

			{/* Questions */}
			<section className="py-12 lg:px-20 flex flex-col items-center gap-8 lg:gap-12">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col justify-center items-center gap-5">
						<Typography
							fontWeight="medium"
							color="gray-darker"
							className="capitalize text-3xl md:!text-5xl text-center leading-[100%]"
						>
							FAQs
						</Typography>
						<Typography
							variant="p-xl"
							color="BR500"
							className="leading-[26px] tracking-[-1%] text-center w-11/12 lg:w-3/5"
						>
							Find everything you need to know about ordering, customization, shipping,
							returns, and more. If you need further assistance, our team is here to
							help
						</Typography>
					</div>

					<div className="flex items-center justify-center gap-[10px] flex-wrap">
						{FAQTabs.map((tab) => {
							return (
								<LandingTab
									name={tab.name}
									isActiveTab={tab.linkName === isActiveFAQTab}
									onClick={() => setIsActiveFAQTab(tab.linkName)}
								/>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col items-center justify-center px-4 w-11/12 lg:w-3/5">
					{LANDING_FAQS.map((item, itemIndex) => (
						<AccordionWrapper
							key={item.id}
							title={item.title}
							isOpen={itemIndex === isActiveAccordion}
							toggleAccordion={() => setIsActiveAccordion(itemIndex)}
						>
							<Typography variant="p-l" className="leading-[31px] text-BR500 lg:w-4/5">
								{item.description}
							</Typography>
						</AccordionWrapper>
					))}
				</div>
			</section>

			{/* Subscribe Now */}
			<section className="bg-LB50 flex flex-col items-center justify-center gap-6 py-16">
				<Typography
					fontWeight="medium"
					color="gray-darker"
					className="capitalize text-3xl md:!text-5xl text-center leading-[100%]"
				>
					Stay Timeless. <br />
					Stay Exclusive.
				</Typography>

				<Typography
					variant="p-xl"
					color="BR500"
					className="leading-[26px] text-center w-11/12 lg:w-3/5"
				>
					Join our VIP list for early access to new collections, exclusive discounts,
					and behind-the-scenes craftsmanship stories. Plus, enjoy 10% off your first
					order!
				</Typography>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 w-11/12 lg:w-3/5 max-w-[638px]"
				>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Input your email address"
						className="md:w-[70%] border border-[#D8D8D8] py-4 px-7 bg-transparent placeholder:text-[#606060]"
						// onChangeCapture={}
					/>
					<Button variant="brown" shape="none" className="md:w-[30%] uppercase py-5">
						subscribe now
					</Button>
				</form>
			</section>

			<Footer />
		</main>
	);
}
