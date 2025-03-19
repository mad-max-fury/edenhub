import * as Yup from "yup";

export const updateInfoFormValidationSchema = Yup.object().shape({
  staffId: Yup.string().required("Staff ID is required"),
  employmentTypeId: Yup.string().required("Employment Type is required"),
  jobTitleId: Yup.string().required("Job Title is required"),
  jobDesignationId: Yup.string().required("Job Designation is required"),
  companyId: Yup.string().required("Company is required"),
  locationId: Yup.string().required("Work Location is required"),
  businessUnitId: Yup.string().required("Business Unit is required"),
  departmentId: Yup.string().required("Department is required"),
  hireDate: Yup.string().required("to date is required"),
});
