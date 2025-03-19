import * as yup from "yup";

export const assignRoleSchema = yup.object().shape({
  role: yup
    .object()
    .shape({
      label: yup.string().required("Please select a role"),
      value: yup.string().required("Please select a role"),
    })
    .required("Please select a role"),
});
export const addStaffIDSchema = yup.object().shape({
  newStaffId: yup.string().required("please select a staff ID"),
  oldUserId: yup.string().required("please select a staff ID"),
});
