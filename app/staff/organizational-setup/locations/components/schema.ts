import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Please input location name")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
    ),
  code: yup
    .string()
    .trim()
    .required("Please input location code")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
    ),
  companyId: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
    )
    .min(1, "Please select at least one company")
    .required("Please select a company"),
  countryId: yup
    .object()
    .shape({
      label: yup.string().required("Please select a country"),
      value: yup.string().required("Please select a country"),
    })
    .required("Please select a country"),
  stateId: yup
    .object()
    .shape({
      label: yup.string().required("Please select a state"),
      value: yup.string().required("Please select a state"),
    })
    .required("Please select a state"),
  address: yup.string().required("Please input street address"),
});
