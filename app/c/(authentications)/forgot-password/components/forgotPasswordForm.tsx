"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button } from "@/components";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "../../schema";
import {
	IForgotPasswordFilterProps,
	IForgotPasswordPayload,
} from "../../interfaces";
import AuthWrapper from "../../components/AuthWrapper";
import { AuthRouteConfig } from "@/constants/routes";

interface IForgotPasswordFormProps {
	setFilter: React.Dispatch<React.SetStateAction<IForgotPasswordFilterProps>>;
}

export const ForgotPasswordForm = ({ setFilter }: IForgotPasswordFormProps) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IForgotPasswordPayload>({
		resolver: yupResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: IForgotPasswordPayload) => {
		// router.push(`/c/verify-otp?email=${data.email}`);
		setFilter({ isSubmitted: true, email: data.email });
	};

	return (
		<AuthWrapper
			title="Forgot Password?"
			description="Enter your email address and we’ll send you a link to reset your password."
			linkText="Go back to"
			linkSubText="Sign in"
			linkHref={AuthRouteConfig.LOGIN}
			hideAuthOptions
		>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
				<TextField
					inputType="input"
					name="email"
					type="email"
					label="Email Address"
					placeholder="example@youremail.com"
					register={register}
					error={!!errors.email}
					errorText={errors.email?.message}
				/>
				<Button variant="brown-light" className="w-full capitalize">
					send reset link
				</Button>
			</form>
		</AuthWrapper>
	);
};
