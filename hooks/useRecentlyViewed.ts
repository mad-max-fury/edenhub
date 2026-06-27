"use client";

import { useEffect, useState } from "react";
import type { ICatalogProduct } from "@/redux/api/catalog";

const KEY = "recentlyViewed";
const MAX = 12;
const EVENT = "recentlyViewed:update";

const read = (): ICatalogProduct[] => {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as ICatalogProduct[]) : [];
	} catch {
		return [];
	}
};

/** Record a product as recently viewed (most-recent first, deduped, capped). */
export const recordRecentlyViewed = (product?: ICatalogProduct) => {
	if (typeof window === "undefined" || !product?._id) return;
	const next = [product, ...read().filter((p) => p._id !== product._id)].slice(
		0,
		MAX,
	);
	localStorage.setItem(KEY, JSON.stringify(next));
	window.dispatchEvent(new Event(EVENT));
};

/** Reactive list of recently viewed products (syncs across tabs + in-page). */
export const useRecentlyViewed = () => {
	const [items, setItems] = useState<ICatalogProduct[]>([]);

	useEffect(() => {
		const sync = () => setItems(read());
		sync();
		window.addEventListener(EVENT, sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener(EVENT, sync);
			window.removeEventListener("storage", sync);
		};
	}, []);

	return items;
};
