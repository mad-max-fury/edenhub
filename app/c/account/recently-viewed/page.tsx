"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ShoppingBag } from "lucide-react";
import { Typography } from "@/components";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCart } from "@/hooks/useCart";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const RecentlyViewedPage = () => {
	const items = useRecentlyViewed();
	const { addItem } = useCart();

	return (
		<div>
			<h2 className="text-lg font-bold text-N900 mb-5">Recently Viewed</h2>

			{items.length === 0 ? (
				<div className="text-center py-20 flex flex-col items-center gap-3">
					<Clock size={48} className="text-N200" />
					<Typography color="N500" className="text-sm">No recently viewed products yet.</Typography>
					<Link href="/shop" className="text-sm text-BR500 hover:underline font-medium">Browse shop</Link>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{items.map((p) => {
						const price = p.discount?.price && p.discount.price > 0 ? p.discount.price : p.basePrice;
						const image = p.coverImage || p.images?.[0] || "";
						const inStock = (p.quantity ?? 0) > 0 || (p.variants ?? []).some((v) => v.quantity > 0);
						return (
							<div key={p._id} className="border border-N30 rounded overflow-hidden group">
								<Link href={`/shop/${p._id}`} className="block aspect-square relative bg-N10 overflow-hidden">
									{image && <Image src={image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
								</Link>
								<div className="p-3 flex flex-col gap-1.5">
									<Link href={`/shop/${p._id}`}>
										<div className="text-sm text-N800 truncate">{p.name}</div>
									</Link>
									<div className="text-sm font-semibold text-N900">{money(price)}</div>
									<button
										disabled={!inStock}
										onClick={() => addItem({ product: p._id, quantity: 1, name: p.name, image, unitPrice: price, stock: p.quantity || 9999, engravingConfig: p.engraving })}
										className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-N40 text-N700 rounded hover:border-BR400 hover:text-BR500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
									>
										<ShoppingBag size={12} />
										{inStock ? "Add to cart" : "Out of stock"}
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default RecentlyViewedPage;
