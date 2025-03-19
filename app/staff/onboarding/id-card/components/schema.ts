import {
  checkIfFilesAreTooBig,
  checkIfImagesAreCorrectType,
} from "@/utils/helpers";
import * as yup from "yup";

export const shema = yup.object().shape({
  passport: yup
    .mixed<File>()
    .required("passport is required")
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
        value ? checkIfImagesAreCorrectType(value) : true,
    ),
  signature: yup
    .mixed<File>()
    .required("signature is required")
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
        value ? checkIfImagesAreCorrectType(value) : true,
    ),
});
