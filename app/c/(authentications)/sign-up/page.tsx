"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, Checkbox } from "@/components";
import AuthWrapper from "../components/AuthWrapper";
import { signupSchema } from "../schema";
import { ISignUpPayload } from "../interfaces";
import Link from "next/link";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { AuthRouteConfig } from "@/constants/routes";

const SignupPage = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		clearErrors,
	} = useForm<ISignUpPayload>({
		resolver: yupResolver(signupSchema),
		defaultValues: { agreedToTerms: false },
		mode: "onChange",
	});

	const onSubmit = (data: ISignUpPayload) => {
		console.log("Form submitted:", data);
		router.push(`${AuthRouteConfig.VERIFY_OTP}?email=` + data.email);
		// Submit logic
	};

	return (
		<AuthWrapper
			title="Create your account"
			description="Create an account by filling the form below with your personal information."
			linkText="Already have an account?"
			linkSubText="Sign in"
			linkHref={AuthRouteConfig.LOGIN}
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
						id="agreedToTerms"
						checked={watch("agreedToTerms")}
						value={`${watch("agreedToTerms")}`}
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
						onSelect={() =>
							fieldSetterAndClearer({
								value: !watch("agreedToTerms"),
								setterFunc: setValue,
								setField: "agreedToTerms",
								clearErrors,
							})
						}
					/>
					{errors.agreedToTerms && (
						<p className="mt-1 text-xs text-red-500">
							{errors.agreedToTerms.message}
						</p>
					)}
				</div>
				<div className="mt-5">
					<Checkbox
						id="notificationTerms"
						checked={watch("notificationTerms")}
						value={`${watch("notificationTerms")}`}
						label={"I agree to receive marketing notifications with offers and news"}
						onSelect={() =>
							fieldSetterAndClearer({
								value: !watch("notificationTerms"),
								setterFunc: setValue,
								setField: "notificationTerms",
								clearErrors,
							})
						}
					/>
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
