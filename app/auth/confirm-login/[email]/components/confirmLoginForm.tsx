"use client";

import { useRouter } from "next/navigation";
import { Button, notify, TextField } from "@/components";
import { cookieValues } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  ILoginPayload,
  IVerifyUserResponse,
  useLoginMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  password: yup.string().required("Please enter your password"),
  userName: yup.string().required(),
});

export const ConfirmLogin = ({ data }: { data?: IVerifyUserResponse }) => {
  const [login, { isLoading }] = useLoginMutation();
  const { replace } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver<ILoginPayload>(schema),
    defaultValues: {
      userName: data?.email,
    },
    mode: "onChange",
  });

  const onSubmit = (values: ILoginPayload) => {
    const payload = {
      password: values.password,
      userName: values.userName,
    };
    login(payload)
      .unwrap()
      .then(({ data }) => {
        setCookie(cookieValues.token, data?.jwtToken?.token);
        setCookie(cookieValues.userType, "staff");
        if (data?.role === "enrollment") {
          replace(AuthRouteConfig.STAFF_ONBOARDING);
          return;
        }
        replace(AuthRouteConfig.DASHBOARD);
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Verification failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  return (
    <form className="mt-7 w-full" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        type="password"
        placeholder="Enter password"
        name="password"
        label="Password"
        register={register}
        error={!!errors.password}
        errorText={errors.password && errors.password.message}
      />
      <Button
        className="mb-5 mt-10 flex w-full !items-center !justify-center !text-center font-bold"
        variant={"primary"}
        loading={isLoading}
        disabled={!isDirty}
      >
        Log in
      </Button>
    </form>
  );
};
