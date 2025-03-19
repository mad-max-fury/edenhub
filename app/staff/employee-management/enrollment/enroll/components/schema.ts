import { checkIfSpecialCharacters } from "@/utils/formValidations";
import * as Yup from "yup";





export const basicInformationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
    ),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .test(
      "check-input-type",
      "Only letters are allowed",
      checkIfSpecialCharacters,
    ),
  middleName: Yup.string().trim().optional(),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Must be a valid email address"),
});

export const employmentTypeValidationSchema = Yup.object().shape({
  employmentType: Yup.string().required("Please select an employment type"),
});

export const employmentDetailsValidationSchema = Yup.object().shape({
  jobTitleId: Yup.string().required("Job Title is required"),
  jobDesignationId: Yup.string().required("Job Designation is required"),
  companyId: Yup.string().required("Company is required"),
  locationId: Yup.string().required("Work Location is required"),
  businessUnitId: Yup.string().required("Business Unit is required"),
  departmentId: Yup.string().required("Department is required"),
  hireDate: Yup.string().required("to date is required"),
});

export const onboardingSetupValidationSchema = Yup.object().shape({
  requiredDocument: Yup.array()
    .of(Yup.string().required())
    .required("Please select required documents"),
  requiredForm: Yup.array()
    .of(Yup.string().required())
    .required("please select required forms"),
});

export const enrollmentReviewerValidationSchema = Yup.object().shape({
  reviewerUserId: Yup.string().required("please select an assignee"),
});
