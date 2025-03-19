import * as Yup from "yup";

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
