"use client";

import React from "react";
import AuthWrapper from "../components/AuthWrapper";
import { Button, TextField, notify } from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { ICreateNewPasswordFormData } from "../interfaces";
import { createNewPasswordSchema } from "../schema";
import { AuthRouteConfig } from "@/constants/routes";
import { getApiErrorMessage } from "@/utils/helpers";
import { useResetPasswordMutation } from "@/redux/api/auth";

const CreateNewPassword = () => {
	const router = useRouter();
	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const params =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search)
			: new URLSearchParams();
	const email = params.get("email") ?? "";
	const code = params.get("code") ?? "";

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ICreateNewPasswordFormData>({
		resolver: yupResolver(createNewPasswordSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: ICreateNewPasswordFormData) => {
		if (!email || !code) {
			notify.error({
				message: "Missing details",
				subtitle: "Please restart the password reset flow",
			});
			router.push(AuthRouteConfig.FORGOT_PASSWORD);
			return;
		}
		try {
			await resetPassword({
				email,
				newPassword: data.password,
				verificationCode: code,
			}).unwrap();
			notify.success({
				message: "Password updated",
				subtitle: "You can now sign in with your new password",
			});
			router.push(AuthRouteConfig.LOGIN);
		} catch (err) {
			notify.error({
				message: "Reset failed",
				subtitle: getApiErrorMessage(err),
			});
		}
	};

	return (
		<AuthWrapper
			title="Create new password"
			description="Please choose a combination of at least 8 characters long and contains at least one letter, one number, and one special character."
			hideFooter
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-5 flex flex-col gap-5 w-full"
			>
				<TextField
					type="password"
					placeholder="Enter new password"
					name="password"
					label="New Password"
					register={register}
					error={!!errors.password}
					errorText={errors.password?.message}
				/>
				<TextField
					type="password"
					placeholder="Re-enter new password"
					name="confirmPassword"
					label="Confirm New Password"
					register={register}
					error={!!errors.confirmPassword}
					errorText={errors.confirmPassword?.message}
				/>
				<Button
					className="mt-8 w-full font-bold capitalize"
					variant="brown-light"
					type="submit"
					loading={isLoading}
				>
					reset password
				</Button>
			</form>
		</AuthWrapper>
	);
};

export default CreateNewPassword;
