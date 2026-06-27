"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { X } from "lucide-react";
import { Button, TextField, Checkbox, notify } from "@/components";
import { Typography } from "@/components/typography";
import { cookieValues } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { fieldSetterAndClearer, getApiErrorMessage } from "@/utils/helpers";
import { useLoginMutation, useSignupMutation } from "@/redux/api/auth";
import { AppLogo } from "@/components/logo/logo";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { GoogleSignInButton } from "@/components/googleSignIn/GoogleSignInButton";

type AuthModalContext = {
  requireAuth: (onSuccess?: () => void) => boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  isLoggedIn: () => boolean;
};

const Ctx = createContext<AuthModalContext | null>(null);

export function useAuthModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthModal must be inside AuthModalProvider");
  return ctx;
}

const specialChars = '!@#$%^&*(),.?":{}|<>';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const signupSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/i, "Must contain a letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      `Must contain a special character (${specialChars})`,
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agreedToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms"),
});

type LoginForm = { email: string; password: string };
type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms?: boolean;
};

function LoginTab({ onSuccess }: { onSuccess: () => void }) {
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data).unwrap();
      const { accessToken, refreshToken, user } = res.data;
      const roleName =
        typeof user.role === "string" ? user.role : user.role?.name;
      setCookie(cookieValues.token, accessToken);
      setCookie(cookieValues.userType, roleName ?? "customer");
      setCookie("ed-refresh", refreshToken);
      notify.success({
        message: "Welcome back!",
        subtitle: "You are now signed in",
      });
      onSuccess();
    } catch (err) {
      notify.error({
        message: "Login failed",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
        placeholder="Enter password"
        name="password"
        label="Password"
        register={register}
        error={!!errors.password}
        errorText={errors.password?.message}
      />
      <div className="flex justify-end">
        <Link
          href={AuthRouteConfig.FORGOT_PASSWORD}
          className="text-sm text-BR400 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
      <Button
        className="w-full !justify-center font-bold"
        variant="brown-light"
        type="submit"
        loading={isLoading}
      >
        Sign In
      </Button>
    </form>
  );
}

function SignupTab({ onSwitch }: { onSwitch: () => void }) {
  const [signup, { isLoading }] = useSignupMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<SignupForm>({
    resolver: yupResolver(signupSchema),
    defaultValues: { agreedToTerms: false },
    mode: "onChange",
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      notify.success({
        message: "Account created",
        subtitle: "Please sign in to continue",
      });
      onSwitch();
    } catch (err) {
      notify.error({
        message: "Sign up failed",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <TextField
          inputType="input"
          name="firstName"
          type="text"
          placeholder="First name"
          label="First Name"
          register={register}
          error={!!errors.firstName}
          errorText={errors.firstName?.message}
        />
        <TextField
          inputType="input"
          name="lastName"
          type="text"
          placeholder="Last name"
          label="Last Name"
          register={register}
          error={!!errors.lastName}
          errorText={errors.lastName?.message}
        />
      </div>
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
      <Checkbox
        id="modal-agreedToTerms"
        checked={watch("agreedToTerms")}
        value={`${watch("agreedToTerms")}`}
        label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="text-BR400 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-BR400 underline">
              Privacy Policy
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
        <p className="text-xs text-red-500 -mt-2">
          {errors.agreedToTerms.message}
        </p>
      )}
      <Button
        className="w-full !justify-center font-bold"
        variant="brown-light"
        type="submit"
        loading={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
}

export function AuthModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const callbackRef = useRef<(() => void) | undefined>();

  const isLoggedIn = useCallback(
    () => !!document.cookie.includes(cookieValues.token),
    [],
  );

  const openAuthModal = useCallback((onSuccess?: () => void) => {
    callbackRef.current = onSuccess;
    setTab("login");
    setOpen(true);
  }, []);

  const requireAuth = useCallback(
    (onSuccess?: () => void) => {
      if (isLoggedIn()) {
        onSuccess?.();
        return true;
      }
      openAuthModal(onSuccess);
      return false;
    },
    [isLoggedIn, openAuthModal],
  );

  const handleSuccess = () => {
    setOpen(false);
    callbackRef.current?.();
    callbackRef.current = undefined;
  };

  const handleClose = () => {
    setOpen(false);
    callbackRef.current = undefined;
  };

  return (
    <Ctx.Provider value={{ requireAuth, openAuthModal, isLoggedIn }}>
      {children}

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100000]"
          onClose={handleClose}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <div className="relative flex items-center justify-center px-6 pt-6 pb-8">
                  <AppLogo variant="textHorizontalBlack" size="md" />
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 grid place-items-center w-8 h-8 rounded-full hover:bg-N20 transition-colors text-N600"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex border-b border-N30 px-6">
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className={`flex-1 pb-2.5 text-sm font-medium transition-colors border-b-2 ${
                      tab === "login"
                        ? "border-BR400 text-BR500"
                        : "border-transparent text-N400 hover:text-N600"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("signup")}
                    className={`flex-1 pb-2.5 text-sm font-medium transition-colors border-b-2 ${
                      tab === "signup"
                        ? "border-BR400 text-BR500"
                        : "border-transparent text-N400 hover:text-N600"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="px-6 py-5">
                  {tab === "login" ? (
                    <LoginTab onSuccess={handleSuccess} />
                  ) : (
                    <SignupTab onSwitch={() => setTab("login")} />
                  )}

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-N30" />
                    <span className="text-xs text-N400">or</span>
                    <div className="flex-1 h-px bg-N30" />
                  </div>

                  <GoogleSignInButton onSuccess={handleSuccess} />
                </div>

                <div className="px-6 pb-5 text-center">
                  <Typography color="N400" className="text-sm">
                    {tab === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setTab("signup")}
                          className="text-BR400 font-medium hover:underline"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setTab("login")}
                          className="text-BR400 font-medium hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </Typography>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </Ctx.Provider>
  );
}
