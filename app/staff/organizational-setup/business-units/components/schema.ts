import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("please input business unit name")
    .test(
      "check-input-type",
      "only letters are allowed",
      checkIfSpecialCharacters,
    ),
  description: yup
    .string()
    .trim()
    .required("please input business unit description")
    .test(
      "check-input-type",
      "only letters are allowed",
      checkIfSpecialCharacters,
    ),
  companyId: yup
    .object()
    .shape({
      label: yup.string().required("Please select a company"),
      value: yup.string().required("Please select a company"),
    })
    .required("Please select a company"),
  departmentId: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
    )
    .min(1, "Please select at least one department")
    .required("Please select a department"),
});
