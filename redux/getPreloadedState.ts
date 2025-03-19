import { cookieValues } from "@/constants/data";
import { getCookie } from "cookies-next";

export const getPreloadedState = () => {
  const token = getCookie(cookieValues.token);
  const defalutValue = {
    auth: {
      access_token: (token ? token : null) as string | null,
    },
  };
  return defalutValue;
};
