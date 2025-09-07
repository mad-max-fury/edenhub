"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthWrapper from "../components/AuthWrapper";
import OtpInput from "react-otp-input";
import { Button, notify, TextField, ValidationText } from "@/components";
import { verifyOtpSchema } from "../schema";
import { IVerifyOtpPayload } from "../interfaces";
import { AuthRouteConfig } from "@/constants/routes";

const RESEND_INTERVAL = 60; // in seconds

const VerifyOtpPage = () => {
	const router = useRouter();
	const searchParams = new URLSearchParams(window.location.search);
	const email = searchParams.get("email");

	if (!email) {
		router.push("/forgot-password");
		return null;
	}

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver<IVerifyOtpPayload>(verifyOtpSchema),
		defaultValues: { otp: "" },
	});

	const [timer, setTimer] = useState(RESEND_INTERVAL);
	const [canResend, setCanResend] = useState(false);

	useEffect(() => {
		if (timer === 0) {
			setCanResend(true);
			return;
		}

		const countdown = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(countdown);
	}, [timer]);

	const handleResend = useCallback(() => {
		// TODO: Call API to resend OTP here
		console.log("Resending OTP to:", email);

		setCanResend(false);
		setTimer(RESEND_INTERVAL);
	}, [email]);

	const onSubmit = async (data: IVerifyOtpPayload) => {
		const token = "mock-reset-token"; // Ideally fetched after verifying the OTP
		router.push(AuthRouteConfig.LOGIN);
		notify.success({
			message: "Account successfully Verified",
			subtitle: "Your account has been verified, proceed to log in",
		});
	};

	return (
		<AuthWrapper
			title="Verify your Account"
			description={`We’ve sent a One-Time Password (OTP) to your email address to verify your account. `}
			hideAuthOptions
			linkText="Go to"
			linkSubText="Sign in"
			linkHref={AuthRouteConfig.LOGIN}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-6 max-w-[450px] mx-auto space-y-6"
			>
				<Controller
					name="otp"
					control={control}
					render={({ field }) => (
						<OtpInput
							value={field.value}
							onChange={field.onChange}
							numInputs={6}
							inputStyle={{
								width: "25%",
								height: "3.5rem",
								margin: "0 0.25rem",
							}}
							containerStyle="flex justify-start gap-2"
							shouldAutoFocus
							renderInput={(props) => (
								<TextField {...props} name="" className="!w-full" inputType="input" />
							)}
						/>
					)}
				/>
				{errors.otp && (
					<ValidationText message={errors.otp.message as string} status={"error"} />
				)}

				<div className="text-sm text-center text-N300">
					{canResend ? (
						<button
							type="button"
							className="text-BR400 font-medium hover:underline"
							onClick={handleResend}
						>
							Resend OTP
						</button>
					) : (
						<span>
							Resend available in <strong>{timer}s</strong>
						</span>
					)}
				</div>

				<Button variant="brown-light" type="submit" className="w-full">
					Verify
				</Button>
			</form>
		</AuthWrapper>
	);
};

export default VerifyOtpPage;
