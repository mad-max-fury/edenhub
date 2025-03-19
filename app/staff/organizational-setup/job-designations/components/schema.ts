import { checkIfSpecialCharacters } from "@/utils/formValidations";
import {
  checkIfFilesAreOfExcelType,
  checkIfFilesAreTooBig,
} from "@/utils/helpers";
import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .required("please input job designation")
    .test(
      "check-input-type",
      "only letters are allowed",
      checkIfSpecialCharacters,
    ),
  leaveDays: yup
    .string()
    .trim()
    .required("please enter the number of leave days")
    .matches(/^\d+$/, "leave days must be a number") // Check for numeric string
    .test(
      "is-greater-than-zero",
      "leave days must be more than 0",
      (value) => !!value && parseInt(value, 10) > 0,
    ),
});

export const importSchema = yup.object().shape({
  file: yup
    .mixed<File>()
    .required("Attachment is required")
    .test(
      "is-correct-file",
      "The file you selected is too big!",
      (value: File | null) => (value ? checkIfFilesAreTooBig(value) : false),
    )
    .test(
      "is-big-file",
      "Wrong file type, ensure this is an excel file!",
      (value: File | null) =>
        value ? checkIfFilesAreOfExcelType(value) : false,
    ),
});
