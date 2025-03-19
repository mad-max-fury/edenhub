import * as yup from "yup";

export const schema = yup.object().shape({
  claims: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Please select a claim"),
        value: yup.string().required("Please select a claim"),
      }),
    )
    .min(1, "Please select at least one claim")
    .required("Please select a claim"),
});
