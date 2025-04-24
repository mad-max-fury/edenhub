"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button } from "@/components";
import AuthWrapper from "../components/AuthWrapper";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "../schema";
import { IForgotPasswordPayload } from "../interfaces";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordPayload>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: IForgotPasswordPayload) => {
    router.push(`/c/verify-otp?email=${data.email}`);
  };

  return (
    <AuthWrapper
      title="Forgot Password?"
      description="Enter your email and we’ll send you a verification code."
      linkText="Go back to"
      linkSubText="Sign in"
      linkHref="/c/login"
      hideAuthOptions
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <TextField
          inputType="input"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          register={register}
          error={!!errors.email}
          errorText={errors.email?.message}
        />
        <Button variant="brown-light" className="w-full">
          Send OTP
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPasswordPage;
