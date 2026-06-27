"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux";
import { cookieValues } from "@/constants/data";
import { useAddCartItemMutation } from "@/redux/api/cart";
import { clearGuestCart } from "@/redux/api/cart/guestCart.slice";

/**
 * When a guest signs in, fold their local cart into the backend cart (which
 * merges with whatever the user already had), then clear the local cart.
 * Re-checks on every route change so it fires after the post-login redirect.
 */
export const CartSync = () => {
	const pathname = usePathname();
	const isLoggedIn = !!getCookie(cookieValues.token);
	const guestItems = useSelector((s: RootState) => s.guestCart.items);
	const dispatch = useDispatch();
	const [addCartItem] = useAddCartItemMutation();
	const merging = useRef(false);

	useEffect(() => {
		if (!isLoggedIn || guestItems.length === 0 || merging.current) return;
		merging.current = true;
		(async () => {
			for (const it of guestItems) {
				try {
					await addCartItem({
						product: it.product,
						variantId: it.variantId,
						quantity: it.quantity,
					}).unwrap();
				} catch {
					// best-effort: skip items that fail (e.g. out of stock)
				}
			}
			dispatch(clearGuestCart());
			merging.current = false;
		})();
	}, [isLoggedIn, guestItems, pathname, addCartItem, dispatch]);

	return null;
};
