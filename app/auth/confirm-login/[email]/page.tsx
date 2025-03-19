"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { notify, Spinner, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useVerifyIfUserQuery } from "@/redux/api";
import { getErrorMessage } from "@/utils/getErrorMessges";

import AuthWrapper from "../../components/authWrapper";
import { ConfirmLogin } from "./components";
import { UserCard } from "./components/userCard";

const Password = () => {
  const params = useParams<{ email: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error } = useVerifyIfUserQuery(
    params.email,
  );

  useEffect(() => {
    if (isError && error) {
      notify.error({
        message: "Verification failed",
        subtitle: getErrorMessage(error),
      });
      router.push(`${AuthRouteConfig.LOGIN}`);
    }
  }, [isError, error, router, params]);

  if (isLoading) return <Spinner />;
  return (
    <AuthWrapper>
      <div className="flex w-full flex-col items-center gap-5">
        <Typography variant="h-l" fontWeight="bold">
          Log in
        </Typography>
        <Typography variant="p-s" className="text-N500">
          Access your resource edge account
        </Typography>
        <div className="my-2 flex w-full justify-center">
          <UserCard data={data?.data} />
        </div>
        <ConfirmLogin data={data?.data} />
        <Link
          href={AuthRouteConfig.FORGOT_PASSWORD}
          className="flex w-full items-center justify-center border-t border-N40 pt-5 text-center"
        >
          <Typography variant="p-m" color="B400" className="cursor-pointer">
            Forgot password?
          </Typography>
        </Link>
      </div>
    </AuthWrapper>
  );
};

export default Password;
