"use client";

import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux";
import { cookieValues } from "@/constants/data";
import {
	useAddCartItemMutation,
	useClearCartMutation,
	useGetCartQuery,
	useRemoveCartItemMutation,
	useSetCartEngravingMutation,
	useUpdateCartItemMutation,
	type IEngraving,
	type IEngravingConfig,
} from "@/redux/api/cart";
import {
	addGuestItem,
	clearGuestCart,
	removeGuestItem,
	setGuestEngraving,
	setGuestQty,
} from "@/redux/api/cart/guestCart.slice";

// A unified cart line regardless of guest/backend source.
export interface CartLine {
	id: string; // backend itemId (_id) or guest key
	product: string;
	variantId?: string;
	name: string;
	image?: string;
	unitPrice: number;
	quantity: number;
	lineTotal: number;
	stock: number;
	engraving?: IEngraving;
	engravingConfig?: IEngravingConfig;
}

export interface AddToCartPayload {
	product: string;
	variantId?: string;
	quantity?: number;
	name: string;
	image?: string;
	unitPrice: number;
	stock: number;
	engravingConfig?: IEngravingConfig;
}

const guestLineTotal = (unitPrice: number, qty: number, fee = 0) =>
	(unitPrice + fee) * qty;

/**
 * One cart API for the whole storefront. Guests get a persisted local cart;
 * authenticated users get the backend cart. The shape is identical either way.
 */
export const useCart = () => {
	const isLoggedIn = !!getCookie(cookieValues.token);
	const dispatch = useDispatch();
	const guestItems = useSelector((s: RootState) => s.guestCart.items);

	const { data, isLoading } = useGetCartQuery(undefined, { skip: !isLoggedIn });
	const [addCartItem] = useAddCartItemMutation();
	const [updateCartItem] = useUpdateCartItemMutation();
	const [removeCartItem] = useRemoveCartItemMutation();
	const [setCartEngraving] = useSetCartEngravingMutation();
	const [clearBackendCart] = useClearCartMutation();

	const items: CartLine[] = isLoggedIn
		? (data?.data.items ?? []).map((it) => ({
				id: it._id,
				product: it.product,
				variantId: it.variantId,
				name: it.name,
				image: it.image,
				unitPrice: it.unitPrice,
				quantity: it.quantity,
				lineTotal: it.lineTotal,
				stock: it.stock,
				engraving: it.engraving,
				engravingConfig: it.engravingConfig,
			}))
		: guestItems.map((it) => ({
				id: it.key,
				product: it.product,
				variantId: it.variantId,
				name: it.name,
				image: it.image,
				unitPrice: it.unitPrice,
				quantity: it.quantity,
				lineTotal: guestLineTotal(
					it.unitPrice,
					it.quantity,
					it.engraving?.fee ?? 0,
				),
				stock: it.stock,
				engraving: it.engraving,
				engravingConfig: it.engravingConfig,
			}));

	const subtotal = isLoggedIn
		? (data?.data.subtotal ?? 0)
		: guestItems.reduce(
				(s, i) =>
					s + guestLineTotal(i.unitPrice, i.quantity, i.engraving?.fee ?? 0),
				0,
			);

	const count = isLoggedIn
		? (data?.data.count ?? 0)
		: guestItems.reduce((s, i) => s + i.quantity, 0);

	const addItem = async (p: AddToCartPayload) => {
		if (isLoggedIn) {
			await addCartItem({
				product: p.product,
				variantId: p.variantId,
				quantity: p.quantity ?? 1,
				// Hints for the optimistic cache update.
				name: p.name,
				image: p.image,
				unitPrice: p.unitPrice,
				stock: p.stock,
				engravingConfig: p.engravingConfig,
			}).unwrap();
		} else {
			dispatch(
				addGuestItem({
					product: p.product,
					variantId: p.variantId,
					name: p.name,
					image: p.image,
					unitPrice: p.unitPrice,
					stock: p.stock,
					quantity: p.quantity ?? 1,
					engravingConfig: p.engravingConfig,
				}),
			);
		}
	};

	const setItemQty = async (line: CartLine, quantity: number) => {
		if (isLoggedIn) {
			if (quantity <= 0) await removeCartItem({ itemId: line.id }).unwrap();
			else await updateCartItem({ itemId: line.id, quantity }).unwrap();
		} else {
			dispatch(setGuestQty({ key: line.id, quantity }));
		}
	};

	const removeItem = async (line: CartLine) => {
		if (isLoggedIn) await removeCartItem({ itemId: line.id }).unwrap();
		else dispatch(removeGuestItem({ key: line.id }));
	};

	const setEngraving = async (
		line: CartLine,
		engraving: { font?: string; lines: string[] },
	) => {
		if (isLoggedIn) {
			await setCartEngraving({ itemId: line.id, ...engraving }).unwrap();
		} else {
			dispatch(setGuestEngraving({ key: line.id, ...engraving }));
		}
	};

	const clear = async () => {
		if (isLoggedIn) await clearBackendCart().unwrap();
		else dispatch(clearGuestCart());
	};

	return {
		isLoggedIn,
		items,
		subtotal,
		count,
		isLoading: isLoggedIn && isLoading,
		addItem,
		setItemQty,
		removeItem,
		setEngraving,
		clear,
	};
};
