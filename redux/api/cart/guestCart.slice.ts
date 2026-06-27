import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IEngravingConfig } from "./interface";

export interface GuestEngraving {
	font?: string;
	lines: string[];
	fee: number;
}

// A cart line for guests (no backend itemId — identified by `key`).
export interface GuestCartItem {
	key: string; // `${product}:${variantId ?? ""}`
	product: string;
	variantId?: string;
	name: string;
	image?: string;
	unitPrice: number;
	quantity: number;
	stock: number;
	engraving?: GuestEngraving;
	// Snapshot of the product's engraving offer at add time.
	engravingConfig?: IEngravingConfig;
}

interface GuestCartState {
	items: GuestCartItem[];
}

const initialState: GuestCartState = { items: [] };

const keyOf = (product: string, variantId?: string) =>
	`${product}:${variantId ?? ""}`;

const cap = (stock: number) => (stock && stock > 0 ? stock : Infinity);

const guestCartSlice = createSlice({
	name: "guestCart",
	initialState,
	reducers: {
		addGuestItem: (
			state,
			action: PayloadAction<Omit<GuestCartItem, "key" | "quantity"> & {
				quantity?: number;
			}>,
		) => {
			const { product, variantId, quantity = 1 } = action.payload;
			const key = keyOf(product, variantId);
			const existing = state.items.find((i) => i.key === key);
			if (existing) {
				existing.quantity = Math.min(
					cap(existing.stock),
					existing.quantity + quantity,
				);
			} else {
				state.items.push({
					...action.payload,
					key,
					quantity: Math.min(cap(action.payload.stock), quantity),
				});
			}
		},
		setGuestQty: (
			state,
			action: PayloadAction<{ key: string; quantity: number }>,
		) => {
			const it = state.items.find((i) => i.key === action.payload.key);
			if (!it) return;
			if (action.payload.quantity <= 0) {
				state.items = state.items.filter((i) => i.key !== action.payload.key);
			} else {
				it.quantity = Math.min(cap(it.stock), action.payload.quantity);
			}
		},
		removeGuestItem: (state, action: PayloadAction<{ key: string }>) => {
			state.items = state.items.filter((i) => i.key !== action.payload.key);
		},
		setGuestEngraving: (
			state,
			action: PayloadAction<{ key: string; font?: string; lines: string[] }>,
		) => {
			const it = state.items.find((i) => i.key === action.payload.key);
			if (!it) return;
			const clean = action.payload.lines
				.map((l) => (l ?? "").trim())
				.filter(Boolean);
			// Engraving is only valid when the product offers it; use its fee.
			const cfg = it.engravingConfig;
			it.engraving =
				clean.length && cfg?.available
					? { font: action.payload.font, lines: clean, fee: cfg.fee }
					: undefined;
		},
		clearGuestCart: (state) => {
			state.items = [];
		},
	},
});

export const {
	addGuestItem,
	setGuestQty,
	removeGuestItem,
	setGuestEngraving,
	clearGuestCart,
} = guestCartSlice.actions;
export default guestCartSlice.reducer;
