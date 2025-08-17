"use client";

import React from "react";
import AuthWrapper from "../components/AuthWrapper";
import { Button, Checkbox, TextField, Typography } from "@/components";
import { ISignInPayload } from "../interfaces";
import { LoginSchema } from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { AuthRouteConfig } from "@/constants/routes";
import { fieldSetterAndClearer } from "@/utils/helpers";

const LoginPage = () => {
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

	const onSubmit = (formData: ISignInPayload) => {
		console.log("formData", formData);
	};
	return (
		<AuthWrapper
			title="Welcome back!🖐️"
			description="Sign in back to your account by filling the form below with your personal information."
			linkText="Don’t have an account?"
			linkSubText="Sign up"
			linkHref={AuthRouteConfig.SIGNUP}
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
					className="mb-6 mt-3 flex w-full !items-center !justify-center !text-center font-bold"
					variant={"brown-light"}
					loading={false}
				>
					Sign In
				</Button>
			</form>
		</AuthWrapper>
	);
};

export default LoginPage;
