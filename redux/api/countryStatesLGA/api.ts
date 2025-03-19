import { Response } from "@/redux/api/genericInterface";
import { baseApi } from "@/redux/baseApi";

import { ICountryProps, ILGAProps, IStateProps } from "./interface";

const baseName = "/countryStatesLGA";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCountries: builder.query<Response<ICountryProps[]>, void>({
      query: () => ({
        url: `${baseName}/countries`,
        method: "GET",
      }),
    }),
    getAllStates: builder.query<Response<IStateProps[]>, number>({
      query: (id) => ({
        url: `${baseName}/${id}/states`,
        method: "GET",
      }),
    }),
    getAllLGAs: builder.query<
      Response<ILGAProps[]>,
      { countryId: number; stateId: number }
    >({
      query: ({ countryId, stateId }) => ({
        url: `${baseName}/${countryId}/${stateId}/lgas`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCountriesQuery,
  useLazyGetAllStatesQuery,
  useLazyGetAllLGAsQuery,
} = authApi;
