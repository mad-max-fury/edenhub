import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import { IAd } from "./interface";

const baseName = "/ads";

const adsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveAds: builder.query<Response<IAd[]>, { placement?: string } | void>({
      query: (params) => ({
        url: `${baseName}/active`,
        method: "GET",
        params: params || {},
      }),
    }),

    getAd: builder.query<Response<IAd>, string>({
      query: (id) => ({ url: `${baseName}/${id}`, method: "GET" }),
    }),
  }),
});

export const { useGetActiveAdsQuery, useGetAdQuery } = adsApi;
