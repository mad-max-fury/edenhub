import { checkIfFileIsPDFType, checkIfFilesAreTooBig } from "@/utils/helpers";
import * as yup from "yup";

export const shema = yup.object().shape({
  guarantorForm1: yup
    .mixed<File>()
    .required("document is required")
    .test(
      "is-correct-file",
      "The file you selected is too big!",
      (value: File | null) => {
        return value ? checkIfFilesAreTooBig(value) : true;
      },
    )
    .test(
      "is-big-file",
      "Wrong file type, ensure this is a PDF file!",
      (value: File | null) => (value ? checkIfFileIsPDFType(value) : true),
    ),
  guarantorForm2: yup
    .mixed<File>()
    .required("document is required")
    .test(
      "is-correct-file",
      "The file you selected is too big!",
      (value: File | null) => {
        return value ? checkIfFilesAreTooBig(value) : true;
      },
    )
    .test(
      "is-big-file",
      "Wrong file type, ensure this is a PDF file!",
      (value: File | null) => (value ? checkIfFileIsPDFType(value) : true),
    ),
});
