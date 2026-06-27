import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";
import { ICatalogProduct } from "@/redux/api/catalog";

const baseName = "/user/wishlist";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<Response<ICatalogProduct[]>, void>({
      query: () => ({ url: baseName, method: "GET" }),
      providesTags: [{ type: tagTypes.GET_WISHLIST }],
    }),

    addWishlist: builder.mutation<Response<ICatalogProduct[]>, string>({
      query: (productId) => ({
        url: `${baseName}/${productId}`,
        method: "POST",
      }),
      // Optimistically mark the product saved so the heart flips instantly.
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData(
            "getWishlist",
            undefined,
            (draft) => {
              if (draft?.data && !draft.data.some((p) => p._id === productId)) {
                draft.data.unshift({ _id: productId } as ICatalogProduct);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: tagTypes.GET_WISHLIST }],
    }),

    removeWishlist: builder.mutation<Response<ICatalogProduct[]>, string>({
      query: (productId) => ({
        url: `${baseName}/${productId}`,
        method: "DELETE",
      }),
      // Optimistically drop it from the saved list.
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData(
            "getWishlist",
            undefined,
            (draft) => {
              if (draft?.data) {
                draft.data = draft.data.filter((p) => p._id !== productId);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: tagTypes.GET_WISHLIST }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi;
