"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, notify, TextField, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { IVerifyUserPayload, useSendResetPasswordMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import AuthWrapper from "../components/authWrapper";
import { emailSchema } from "./schema";

const Password = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver<IVerifyUserPayload>(emailSchema),
    mode: "onChange",
  });
  const [sendPasswordResetLink, { isLoading }] = useSendResetPasswordMutation();
  const onSubmit = (values: IVerifyUserPayload) => {
    sendPasswordResetLink(values.email)
      .unwrap()
      .then(() => {
        router.push(AuthRouteConfig.VERIFICATION_CONFIRMATION);
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Verification failed",
          subtitle: getErrorMessage(err),
        });
      });
  };
  return (
    <AuthWrapper>
      <div className="flex w-full flex-col items-center gap-5">
        <Typography variant="h-l" fontWeight="bold">
          Reset Password
        </Typography>
        <Typography variant="p-s" className="text-N500">
          To enable us reset your password, enter your email below
        </Typography>

        <form
          className="mt-7 flex w-full flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            inputType="input"
            name="email"
            type="email"
            placeholder="Enter email"
            label="Email Address"
            className="mb-10"
            register={register}
            error={!!errors.email}
            errorText={errors.email && errors.email.message}
          />
          <Button
            className="mb-5 flex w-full !items-center !justify-center !text-center font-bold"
            variant={"primary"}
            disabled={!isValid}
            loading={isLoading}
          >
            Send Recovery Link
          </Button>
        </form>

        <Link
          href={AuthRouteConfig.LOGIN}
          className="flex w-full items-center justify-center border-t border-N40 pt-5 text-center"
        >
          <Typography variant="p-m" color="B400" className="cursor-pointer">
            Back to login
          </Typography>
        </Link>
      </div>
    </AuthWrapper>
  );
};

export default Password;
