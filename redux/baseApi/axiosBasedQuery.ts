import { AuthRouteConfig } from "@/constants/routes";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  Method,
} from "axios";
import { deleteCookie, getCookies } from "cookies-next";

import { getPreloadedState } from "../getPreloadedState";

export const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getPreloadedState().auth.access_token;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export const axiosBaseQuery =
  ({
    baseUrl = "",
    baseHeaders = {},
  }: {
    baseUrl: string;
    baseHeaders?: AxiosRequestConfig["headers"];
  }): BaseQueryFn<
    {
      url: string;
      method: Method;
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      responseType?: AxiosRequestConfig["responseType"];
    },
    // eslint-disable-next-line
    any,
    unknown
  > =>
  async ({ url, method, data, params, headers = {}, responseType }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        params,
        data,
        headers: { ...baseHeaders, ...headers },
        responseType: responseType || "json",
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response?.status === 401) {
        const allCookies = getCookies();
        Object.keys(allCookies).map((key) => {
          deleteCookie(key);
        });
        window.location.href = AuthRouteConfig.HOME;
      }
      if (err.response?.status === 403) {
        window.location.href = AuthRouteConfig.NO_ACCESS;
      }
      return {
        error: {
          status: err.response?.status,
          error: err.message,
          ...(typeof err.response?.data === "object" ? err.response.data : {}),
        },
      };
    }
  };
