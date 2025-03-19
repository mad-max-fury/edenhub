import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as Yup from "yup";
import * as yup from "yup";

export const documentSchema = Yup.object().shape({
  name: Yup.string()
    .required("Document name is required")
    .max(100, "Document name cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  documentCategory: Yup.string().required("Category is required"),
  template: Yup.string().min(100).required("Template is required"),

  isCompleted: Yup.boolean().required("isompleted is required"),
  requiresSigning: Yup.boolean().required("requires signing is required"),
  requiresNotification: Yup.boolean().required(
    "requiresNotification is required",
  ),
  requiresUpload: Yup.boolean().required("requiresUpload is required"),
});

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
  numberOfDays: yup
    .number()
    .typeError("Number of days must be a valid number")
    .required("Please input the number of days")
    .positive("Number of days must be a positive value")
    .integer("Number of days must be an integer"),
  requiredDocument: yup
    .string()
    .required("Please select if a document is required")
    .oneOf(["Yes", "No"], "Please select either 'Yes' or 'No'"),
  document: yup.string().when("requiredDocument", {
    is: "Yes",
    then: (schema) =>
      schema.required("Please provide the document name").trim(),
    otherwise: (schema) => schema.nullable(),
  }),
  leaveTypeId: yup.string().required("Please select a leave type"),
  leaveDaysOptionId: yup.object().shape({
    label: yup.string().required("please select a leave day"),
    value: yup.string().required("please select a leave day"),
  }),
});
