import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as yup from "yup";

export const schema = yup.object().shape({
  reason: yup
    .string()
    .trim()
    .required("please input a reason")
    .test(
      "check-input-type",
      "only letters are allowed",
      checkIfSpecialCharacters,
    ),
});
