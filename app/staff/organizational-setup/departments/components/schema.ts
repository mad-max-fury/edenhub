import { checkIfSpecialCharacters } from "@/utils/formValidations";
import {
  checkIfFilesAreOfExcelType,
  checkIfFilesAreTooBig,
} from "@/utils/helpers";
import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Please input department name")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
    ),
  code: yup
    .string()
    .trim()
    .required("Please input department code")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
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
