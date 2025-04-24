export interface ISignInPayload {
  email: string;
  password: string;
}

export interface ICreateNewPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ISignUpPayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms?: boolean;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IVerifyOtpPayload {
  otp: string;
}
