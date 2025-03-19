import { checkForValidPassword } from "@/utils/formValidations";
import * as yup from "yup";

export const resetSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .test(
      "validate password",
      "password must be between 8 to 15 characters which contains at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
      checkForValidPassword,
    ),
  confirmPassword: yup
    .string()
    .required("New password is required")
    .test("passwords-match", "passwords do not match", function (value) {
      return this.parent.newPassword === value;
    }),
});
