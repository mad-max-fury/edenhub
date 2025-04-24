"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, Checkbox, Typography } from "@/components";
import AuthWrapper from "../components/AuthWrapper";
import { signupSchema } from "../schema";
import { ISignUpPayload } from "../interfaces";
import Link from "next/link";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ISignUpPayload>({
    resolver: yupResolver(signupSchema),
    mode: "onChange",
  });

  const agreedToTerms = watch("agreedToTerms");

  const onSubmit = (data: ISignUpPayload) => {
    console.log("Form submitted:", data);
    // Submit logic
  };

  return (
    <AuthWrapper
      title="Create your account"
      description="Create an account by filling the form below with your personal information."
      linkText="Already have an account?"
      linkSubText="Sign in"
      linkHref="/c/login"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5 w-full"
      >
        <TextField
          inputType="input"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          label="First Name"
          register={register}
          error={!!errors.firstName}
          errorText={errors.firstName?.message}
        />

        <TextField
          inputType="input"
          name="middleName"
          type="text"
          placeholder="Enter your middle name"
          label="Middle Name"
          register={register}
          error={!!errors.middleName}
          errorText={errors.middleName?.message}
        />

        <TextField
          inputType="input"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          label="Last Name"
          register={register}
          error={!!errors.lastName}
          errorText={errors.lastName?.message}
        />
        <TextField
          inputType="input"
          name="email"
          type="email"
          placeholder="Enter email"
          label="Email Address"
          register={register}
          error={!!errors.email}
          errorText={errors.email?.message}
        />
        <TextField
          type="password"
          name="password"
          placeholder="Enter password"
          label="Password"
          register={register}
          error={!!errors.password}
          errorText={errors.password?.message}
        />
        <TextField
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          label="Confirm Password"
          register={register}
          error={!!errors.confirmPassword}
          errorText={errors.confirmPassword?.message}
        />

        <div className="mt-5">
          <Checkbox
            id="terms"
            label={
              <>
                I agree to the{" "}
                <Link href="/terms" className="text-BR400 underline">
                  Terms of Service
                </Link>
                ,{" "}
                <Link href="/privacy" className="text-BR400 underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/usage" className="text-BR400 underline">
                  Terms of Use
                </Link>
              </>
            }
            checked={agreedToTerms}
            onSelect={(e) =>
              setValue("agreedToTerms", e.target.checked, {
                shouldValidate: true,
              })
            }
            required
          />
          {errors.agreedToTerms && (
            <p className="mt-1 text-xs text-red-500">
              {errors.agreedToTerms.message}
            </p>
          )}
        </div>

        <Button
          className="mb-5 mt-10 flex w-full !items-center !justify-center !text-center font-bold"
          variant="brown-light"
          loading={false}
        >
          Sign Up
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default SignupPage;
