export interface IUserRole {
  _id: string;
  name: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  country?: string;
  state?: string;
  city?: string;
  isActive: boolean;
  isVerified: boolean;
  role: IUserRole | string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: "email" | "authenticator";
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  twoFactorRequired?: boolean;
  twoFactorMethod?: "email" | "authenticator";
  email?: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  newPassword: string;
  verificationCode: string;
}
