import * as yup from "yup";

export const schema = yup.object().shape({
  employee: yup
    .object()
    .shape({
      label: yup.string().required("Please select a employee"),
      value: yup.string().required("Please select a employee"),
    })
    .required("Please select a employee"),
  role: yup
    .object()
    .shape({
      label: yup.string().required("Please select a role"),
      value: yup.string().required("Please select a role"),
    })
    .required("Please select a role"),
});
