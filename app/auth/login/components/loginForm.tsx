"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, TextField, Typography } from "@/components";
import { LOCAL_STORAGE_VALUES } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IVerifyUserPayload, useLazyVerifyIfUserQuery } from "@/redux/api";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { notify } from "@/components/notifications/notify";

import { LoginSchema } from "../schema";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const [verifyUser, { data, isFetching, isSuccess, isError, error }] =
    useLazyVerifyIfUserQuery();
  useEffect(() => {
    if (isError && error)
      notify.error({
        message: "Verification failed",
        subtitle: getErrorMessage(error),
      });
  }, [isError, error]);

  // verifyUser success notification
  useEffect(() => {
    if (isSuccess && data) {
      if (data.data.oldUser) {
        localStorage.setItem(
          LOCAL_STORAGE_VALUES.RE_OLD_USER,
          JSON.stringify(data.data),
        );

        return router.push(`${AuthRouteConfig.OLD_STAFF_ONBOARDING}`);
      } else {
        return router.push(`${AuthRouteConfig.CONFIRM_LOGIN}/${email}`);
      }
    }
  }, [isSuccess, data, email, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IVerifyUserPayload>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = (values: IVerifyUserPayload) => {
    setEmail(values.email);
    verifyUser(values.email);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 mmd:gap-3">
      <Typography variant="h-l" fontWeight="bold">
        Log in
      </Typography>
      <Typography variant="p-s" className="text-N500">
        Access your resource edge account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 w-full">
        <TextField
          inputType="input"
          name="email"
          type="email"
          placeholder="Enter email"
          label="Email Address"
          required
          register={register}
          error={!!errors.email}
          errorText={errors.email && errors.email.message}
        />
        <Button
          className="mb-5 mt-10 flex w-full !items-center !justify-center !text-center font-bold"
          variant={"primary"}
          disabled={!isValid}
          loading={isFetching}
        >
          Continue
        </Button>
      </form>
      <Link
        href={AuthRouteConfig.FORGOT_PASSWORD}
        className="flex w-full items-center justify-center border-t border-N40 pt-5 text-center"
      >
        <Typography variant="p-m" color="B400" className="cursor-pointer">
          Forgot password?
        </Typography>
      </Link>
    </div>
  );
};
