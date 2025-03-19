import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("please input company name")
    .test(
      "check-input-type",
      "only letters are allowed",
      checkIfSpecialCharacters,
    ),
  code: yup
    .string()
    .trim()
    .required("please input company code")
    .test(
      "check-input-type",
      "only letters are allowed",
      checkIfSpecialCharacters,
    ),
});
