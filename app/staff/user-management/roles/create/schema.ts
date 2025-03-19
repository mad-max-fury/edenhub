import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as yup from "yup";

export const schema = yup.object().shape({
  role: yup
    .string()
    .trim()
    .required("Please input location name")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
    ),
});
