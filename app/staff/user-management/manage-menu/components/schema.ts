import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().trim().required("please input menu name"),
});
