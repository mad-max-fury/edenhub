import * as yup from "yup";

export const allowedEmailDomains = [
  "genesystechhub.com",
  "tenece.com",
  "partzshop.com",
  "privateestateswa.com",
  "chloeproducts.com",
  "peiwamc.com",
  "yopmail.com",
];

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email address")
    .required("email is required")
    .test("is-allowed-domain", "invalid company email", (value) => {
      if (!value) return false;
      const domain = value.split("@")[1];
      return allowedEmailDomains.includes(domain);
    }),
});
