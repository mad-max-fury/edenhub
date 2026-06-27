"use client";

import React, { useMemo, useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import { Button, Checkbox, TextField, Typography, notify } from "@/components";
import { ISignInPayload } from "../interfaces";
import { LoginSchema } from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { AuthRouteConfig } from "@/constants/routes";
import { cookieValues } from "@/constants/data";
import { fieldSetterAndClearer, getApiErrorMessage } from "@/utils/helpers";
import { useLoginMutation, useVerify2FAMutation } from "@/redux/api/auth";
import { GoogleSignInButton } from "@/components/googleSignIn/GoogleSignInButton";

const LoginPage = () => {
  const router = useRouter();
  const returnTo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("returnTo") || "";
  }, []);
  const [login, { isLoading }] = useLoginMutation();
  const [verify2FA, { isLoading: verifying }] = useVerify2FAMutation();

  const [twoFA, setTwoFA] = useState<{
    required: boolean;
    method: "email" | "authenticator";
    email: string;
  } | null>(null);
  const [code, setCode] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ISignInPayload>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const completeLogin = (data: any) => {
    const { accessToken, refreshToken, user } = data;
    const roleName =
      typeof user.role === "string" ? user.role : user.role?.name;
    setCookie(cookieValues.token, accessToken);
    setCookie(cookieValues.userType, roleName ?? "customer");
    setCookie("ed-refresh", refreshToken);
    notify.success({
      message: "Welcome back!",
      subtitle: "You are now signed in",
    });
    router.push(returnTo || AuthRouteConfig.HOME);
  };

  const onSubmit = async (formData: ISignInPayload) => {
    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (res.data.twoFactorRequired) {
        setTwoFA({
          required: true,
          method: res.data.twoFactorMethod || "email",
          email: res.data.email || formData.email,
        });
        return;
      }

      completeLogin(res.data);
    } catch (err) {
      notify.error({
        message: "Login failed",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  const onVerify2FA = async () => {
    if (!twoFA || code.length < 5) {
      notify.error({ message: "Enter the verification code" });
      return;
    }
    try {
      const res = await verify2FA({ email: twoFA.email, code }).unwrap();
      completeLogin(res.data);
    } catch (err) {
      notify.error({
        message: "Verification failed",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  // 2FA verification screen
  if (twoFA) {
    return (
      <AuthWrapper
        title={
          twoFA.method === "authenticator"
            ? "Authenticator code"
            : "Check your email"
        }
        description={
          twoFA.method === "authenticator"
            ? "Enter the 6-digit code from your authenticator app."
            : `We sent a verification code to ${twoFA.email}`
        }
        hideFooter
        hideAuthOptions
      >
        <div className="mt-5 flex flex-col gap-5 w-full">
          <div>
            <label className="text-xs text-N500 mb-1 block">
              {twoFA.method === "authenticator"
                ? "Authenticator code"
                : "Verification code"}
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onVerify2FA();
              }}
              className="w-full border border-N40 rounded px-3 py-3 text-center text-xl font-mono tracking-[0.5em] focus:border-BR400 outline-none"
            />
          </div>
          <Button
            className="flex w-full !items-center !justify-center !text-center font-bold"
            variant="brown-light"
            loading={verifying}
            onClick={onVerify2FA}
          >
            Verify
          </Button>
          <button
            type="button"
            onClick={() => {
              setTwoFA(null);
              setCode("");
            }}
            className="text-sm text-N500 hover:text-N800 text-center"
          >
            ← Back to login
          </button>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      title="Welcome back!🖐️"
      description="Sign in back to your account by filling the form below with your personal information."
      linkText="Don't have an account?"
      linkSubText="Sign up"
      linkHref={`${AuthRouteConfig.SIGNUP}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5 w-full"
      >
        <TextField
          inputType="input"
          name="email"
          type="email"
          placeholder="Enter email"
          label="Email Address"
          register={register}
          error={!!errors.email}
          errorText={errors.email && errors.email.message}
        />
        <TextField
          type="password"
          placeholder="Enter password"
          name="password"
          label="Password"
          register={register}
          error={!!errors.password}
          errorText={errors.password && errors.password.message}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            id="keepUserSignedIn"
            checked={watch("keepUserSignedIn")}
            value={`${watch("keepUserSignedIn")}`}
            label="Keep me signed in"
            onSelect={() =>
              fieldSetterAndClearer({
                value: !watch("keepUserSignedIn"),
                setterFunc: setValue,
                setField: "keepUserSignedIn",
                clearErrors,
              })
            }
          />
          <Link href={AuthRouteConfig.FORGOT_PASSWORD}>
            <Typography
              className="hover:underline"
              color={"BR400"}
              fontWeight={"medium"}
            >
              Forgot Password
            </Typography>
          </Link>
        </div>
        <Button
          className="mb-3 mt-3 flex w-full !items-center !justify-center !text-center font-bold"
          variant={"brown-light"}
          type="submit"
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="w-full flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-N30" />
        <span className="text-xs text-N400">or</span>
        <div className="flex-1 h-px bg-N30" />
      </div>

      <GoogleSignInButton returnTo={returnTo} />
    </AuthWrapper>
  );
};

export default LoginPage;
