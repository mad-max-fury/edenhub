import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import {
  IBestSellersQuery,
  ICatalogListResponse,
  ICatalogProduct,
  ICatalogQuery,
  ICatalogTreeNode,
} from "./interface";

const baseName = "/catalog";

const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogProducts: builder.query<ICatalogListResponse, ICatalogQuery>({
      query: (params) => ({
        url: `${baseName}/products`,
        method: "GET",
        params,
      }),
    }),

    getCatalogProduct: builder.query<Response<ICatalogProduct>, string>({
      query: (id) => ({
        url: `${baseName}/products/${id}`,
        method: "GET",
      }),
    }),

    getBestSellers: builder.query<Response<ICatalogProduct[]>, IBestSellersQuery>(
      {
        query: (params) => ({
          url: `${baseName}/best`,
          method: "GET",
          params,
        }),
      },
    ),

    getCatalogCategories: builder.query<Response<ICatalogTreeNode[]>, void>({
      query: () => ({
        url: `${baseName}/categories`,
        method: "GET",
      }),
    }),

    getCatalogBrands: builder.query<Response<string[]>, void>({
      query: () => ({
        url: `${baseName}/brands`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCatalogProductsQuery,
  useGetCatalogProductQuery,
  useGetBestSellersQuery,
  useGetCatalogCategoriesQuery,
  useGetCatalogBrandsQuery,
} = catalogApi;
