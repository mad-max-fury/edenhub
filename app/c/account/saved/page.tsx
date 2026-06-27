"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Package } from "lucide-react";
import { Typography, notify } from "@/components";
import { getApiErrorMessage } from "@/utils/helpers";
import { useGetWishlistQuery, useRemoveWishlistMutation } from "@/redux/api/wishlist";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const SavedItems = () => {
	const { data, isLoading } = useGetWishlistQuery();
	const [removeWishlist] = useRemoveWishlistMutation();
	const items = data?.data ?? [];

	const remove = async (id: string) => {
		try {
			await removeWishlist(id).unwrap();
			notify.success({ message: "Removed from saved items" });
		} catch (err) {
			notify.error({ message: "Action failed", subtitle: getApiErrorMessage(err) });
		}
	};

	if (isLoading) return <div className="text-N400 py-12 text-center">Loading…</div>;

	return (
		<div>
			<h2 className="text-lg font-bold text-N900 mb-5">Saved Items</h2>

			{items.length === 0 ? (
				<div className="text-center py-20 flex flex-col items-center gap-3">
					<Heart size={48} className="text-N200" />
					<Typography color="N500" className="text-sm">You have no saved items yet.</Typography>
					<Link href="/shop" className="text-sm text-BR500 hover:underline font-medium">Browse shop</Link>
				</div>
			) : (
				<div className="divide-y divide-N20">
					{items.map((p) => {
						const inStock = p.quantity > 0 || p.variants?.some((v) => v.quantity > 0);
						const price = p.discount?.price && p.discount.price > 0 ? p.discount.price : p.basePrice;
						const image = p.coverImage || p.images?.[0] || "";
						return (
							<div key={p._id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 py-4">
								<Link href={`/shop/${p._id}`} className="shrink-0">
									<div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-N10 border border-N30 overflow-hidden relative">
										{image ? (
											<Image src={image} alt={p.name} fill className="object-cover" />
										) : (
											<div className="w-full h-full grid place-items-center"><Package size={16} className="text-N300" /></div>
										)}
									</div>
								</Link>
								<div className="flex-1 min-w-0">
									<Link href={`/shop/${p._id}`}>
										<div className="text-sm text-N800 font-medium truncate">{p.name}</div>
									</Link>
									<div className="text-xs text-N400 capitalize mt-0.5">{p.brand || "Product"}</div>
									<div className="flex items-center gap-2 mt-1 sm:hidden">
										<span className="text-sm font-semibold text-N800">{money(price)}</span>
										<span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${inStock ? "bg-G50 text-G600" : "bg-N10 text-N500"}`}>
											{inStock ? "In stock" : "Out of stock"}
										</span>
									</div>
								</div>
								<span className={`hidden sm:inline text-[11px] px-2 py-0.5 rounded font-medium shrink-0 ${inStock ? "bg-G50 text-G600" : "bg-N10 text-N500"}`}>
									{inStock ? "In stock" : "Out of stock"}
								</span>
								<span className="hidden sm:inline text-sm font-semibold text-N800 w-24 text-right shrink-0">{money(price)}</span>
								<button onClick={() => remove(p._id)} className="text-xs sm:text-sm text-R500 hover:underline font-medium shrink-0">Remove</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default SavedItems;
