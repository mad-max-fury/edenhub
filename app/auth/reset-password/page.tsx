"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, notify, TextField, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useResetPasswordMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import AuthWrapper from "../components/authWrapper";
import { resetSchema } from "./schema";

interface IResetProps {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const params = useSearchParams();
  const { push } = useRouter();
  const email = params.get("q");
  const authenticationToken = params.get("w");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetProps>({
    resolver: yupResolver(resetSchema),
  });
  const onSubmit = (values: IResetProps) => {
    const payload = {
      email: email ?? "",
      authenticationToken: authenticationToken ?? "",
      newPassword: values.newPassword,
    };

    resetPassword(payload)
      .unwrap()
      .then(() => {
        push(AuthRouteConfig.LOGIN);
        notify.success({
          message: "Passord Reset Successful!",
          subtitle: "You can proceed to log in",
        });
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Verification failed",
          subtitle: getErrorMessage(err),
        });
      });
  };
  if (!email || !authenticationToken) {
    return push(AuthRouteConfig.FORGOT_PASSWORD);
  }
  return (
    <AuthWrapper>
      <div className="flex w-full flex-col items-center gap-5">
        <Typography variant="h-l" fontWeight="bold">
          Reset Password
        </Typography>
        <Typography variant="p-s" className="text-N500">
          The password should have atleast 8 characters
        </Typography>

        <form
          className="mt-7 flex w-full flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            inputType="input"
            name="newPassword"
            type="password"
            placeholder="Enter password"
            label="New password"
            register={register}
            error={!!errors.newPassword}
            errorText={errors.newPassword && errors.newPassword.message}
          />
          <TextField
            inputType="input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            label="Confirm password"
            register={register}
            error={!!errors.confirmPassword}
            errorText={errors.confirmPassword && errors.confirmPassword.message}
          />
          <Button
            className="mb-5 flex w-full !items-center !justify-center !text-center font-bold"
            variant={"primary"}
            loading={isLoading}
          >
            Reset Password
          </Button>
        </form>

        <div className="flex w-full items-center justify-center border-t border-N40 pt-5 text-center">
          <Link href={AuthRouteConfig.FORGOT_PASSWORD}>
            <Typography variant="p-m" color="B400" className="cursor-pointer">
              Forgot password?
            </Typography>
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ResetPassword;
