import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import { IFaq } from "./interface";

const baseName = "/faqs";

const faqsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicFaqs: builder.query<Response<IFaq[]>, void>({
      query: () => ({ url: `${baseName}/public`, method: "GET" }),
    }),
  }),
});

export const { useGetPublicFaqsQuery } = faqsApi;
