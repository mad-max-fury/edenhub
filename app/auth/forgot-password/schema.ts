import * as yup from "yup";

import { allowedEmailDomains } from "../login/schema";

export const ResetSchema = yup.object().shape({
  newPassword: yup.string().required("Please enter your new password"),
  confirmPassword: yup.string().required("Please enter your new password"),
});

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required("email is required")
    .test("is-allowed-domain", "invalid company email", (value) => {
      if (!value) return false;
      const domain = value.split("@")[1];
      return allowedEmailDomains.includes(domain);
    }),
});
