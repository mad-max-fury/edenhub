import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import { IAddCartItem, ICart, ISetEngraving } from "./interface";

const baseName = "/cart";

// Keep derived totals in sync after an optimistic mutation.
const recompute = (cart: ICart) => {
  cart.count = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.subtotal = cart.items.reduce((s, i) => s + i.lineTotal, 0);
};

const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Response<ICart>, void>({
      query: () => ({ url: baseName, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_CART }],
    }),

    addCartItem: builder.mutation<Response<ICart>, IAddCartItem>({
      query: ({ product, variantId, quantity }) => ({
        url: `${baseName}/items`,
        method: "POST",
        data: { product, variantId, quantity },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data;
            if (!cart) return;
            const qty = arg.quantity ?? 1;
            const existing = cart.items.find(
              (i) =>
                i.product === arg.product &&
                (i.variantId ?? "") === (arg.variantId ?? ""),
            );
            if (existing) {
              existing.quantity += qty;
              existing.lineTotal = existing.unitPrice * existing.quantity;
            } else {
              cart.items.push({
                _id: `temp-${Date.now()}`,
                product: arg.product,
                variantId: arg.variantId,
                name: arg.name ?? "Item",
                image: arg.image,
                unitPrice: arg.unitPrice ?? 0,
                quantity: qty,
                lineTotal: (arg.unitPrice ?? 0) * qty,
                stock: arg.stock ?? 9999,
                engravingConfig: arg.engravingConfig,
              });
            }
            recompute(cart);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: tagTypes.GET_CART }],
    }),

    updateCartItem: builder.mutation<
      Response<ICart>,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `${baseName}/items/${itemId}`,
        method: "PATCH",
        data: { quantity },
      }),
      async onQueryStarted({ itemId, quantity }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data;
            if (!cart) return;
            const it = cart.items.find((i) => i._id === itemId);
            if (it) {
              it.quantity = quantity;
              it.lineTotal = it.unitPrice * quantity;
            }
            recompute(cart);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: tagTypes.GET_CART }],
    }),

    removeCartItem: builder.mutation<Response<ICart>, { itemId: string }>({
      query: ({ itemId }) => ({
        url: `${baseName}/items/${itemId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ itemId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data;
            if (!cart) return;
            cart.items = cart.items.filter((i) => i._id !== itemId);
            recompute(cart);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: tagTypes.GET_CART }],
    }),

    setCartEngraving: builder.mutation<Response<ICart>, ISetEngraving>({
      query: ({ itemId, font, lines }) => ({
        url: `${baseName}/items/${itemId}/engraving`,
        method: "PATCH",
        data: { font, lines },
      }),
      async onQueryStarted(
        { itemId, font, lines },
        { dispatch, queryFulfilled },
      ) {
        const clean = lines.map((l) => (l ?? "").trim()).filter(Boolean);
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data;
            if (!cart) return;
            const it = cart.items.find((i) => i._id === itemId);
            if (it) {
              // Use the product's configured fee, not a flat constant.
              const fee =
                clean.length && it.engravingConfig?.available
                  ? it.engravingConfig.fee
                  : 0;
              it.engraving = clean.length
                ? { font, lines: clean, fee }
                : undefined;
              it.lineTotal = (it.unitPrice + fee) * it.quantity;
            }
            recompute(cart);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: tagTypes.GET_CART }],
    }),

    clearCart: builder.mutation<Response<ICart>, void>({
      query: () => ({ url: baseName, method: "DELETE" }),
      invalidatesTags: [{ type: tagTypes.GET_CART }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useSetCartEngravingMutation,
  useClearCartMutation,
} = cartApi;
