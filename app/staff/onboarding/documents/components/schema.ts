import {
  checkIfFilesAreTooBig,
  checkIfPdfOrImageAreCorrectType,
} from "@/utils/helpers";
import * as yup from "yup";

export const schema = yup.object().shape({
  documentForm: yup
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
      "Wrong file type, ensure this is an image file!",
      (value: File | null) =>
        value ? checkIfPdfOrImageAreCorrectType(value) : true,
    ),
});
