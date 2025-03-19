export interface IVerifyUserPayload {
  email: string;
}

export interface ILoginPayload {
  userName: string;
  password: string;
}

export interface IResetPasswordPayload {
  authenticationToken: string;
  email: string;
  newPassword: string;
}

export interface ICreateUserLoginPayload {
  username: string;
  newPassword: string;
  emailConfirmationAuthenticationToken: string;
  resetPasswordAuthenticationToken: string;
}

export interface IVerifyUserResponse {
  jwtToken: any;
  refreshToken: any;
  email: any;
  passport: any;
  profilePicture: any;
  userType: any;
  fullName: string;
  menuItems: any;
  twoFactor: boolean;
  userId: string;
  employeeId: string;
  role: any;
  oldUser: boolean;
}

export interface ILoginUserResponse {
  jwtToken: {
    token: string;
    issued: string;
    expires: string;
  };
  refreshToken: string;
  email: string;
  passport: string;
  role: string;
  userType: string;
  fullName: string;
  menuItems: string[];
  twoFactor: true;
  userId: string;
  pldUser: true;
}
