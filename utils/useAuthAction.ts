import { useRouter } from "next/navigation";
import { AuthRouteConfig } from "@/constants/routes";
import { baseApi } from "@/redux/baseApi";
import { deleteCookie, getCookies } from "cookies-next";
import { useDispatch } from "react-redux";

export default function useAuthAction() {
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = (callback?: () => void) => {
    const allCookies = getCookies();
    Object.keys(allCookies).map((key) => {
      deleteCookie(key);
    });
    router.replace(AuthRouteConfig.HOME);
    dispatch(baseApi.util.resetApiState());
    if (callback) {
      callback();
    }
  };

  return { logout };
}
