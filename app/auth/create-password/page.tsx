"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, notify, TextField, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { useCreateUserLoginMutation } from "@/redux/api";
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

const CreatePassword = () => {
  const params = useSearchParams();
  const { push } = useRouter();
  const email = params.get("q");
  const emailConfimToken = params.get("w");
  const resetPasswordauthenticationToken = params.get("e");
  const [createUser, { isLoading }] = useCreateUserLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetProps>({
    resolver: yupResolver(resetSchema),
  });
  const onSubmit = (values: IResetProps) => {
    const payload = {
      username: email ?? "",
      newPassword: values.newPassword,
      emailConfirmationAuthenticationToken: emailConfimToken ?? "",
      resetPasswordAuthenticationToken: resetPasswordauthenticationToken ?? "",
    };

    createUser(payload)
      .unwrap()
      .then(() => {
        push(AuthRouteConfig.LOGIN);
        notify.success({
          message: "Success!",
          subtitle:
            "Password created successfully, now login with valid details.",
        });
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Failure!",
          subtitle: getErrorMessage(err),
        });
      });
  };
  if (!email || !emailConfimToken) {
    return push(AuthRouteConfig.FORGOT_PASSWORD);
  }
  return (
    <AuthWrapper>
      <div className="flex w-full flex-col items-center gap-5">
        <Typography variant="h-l" fontWeight="bold">
          Create Password
        </Typography>
        <Typography variant="p-s" className="text-N500">
          Create your resource edge password
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
            Create Password
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

export default CreatePassword;
