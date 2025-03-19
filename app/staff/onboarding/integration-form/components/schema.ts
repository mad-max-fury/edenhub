import * as yup from "yup";

export const shema = yup.object().shape({
  introducedToEveryone: yup.string().required("selection is required"),
  dateIntroducedToEveryone: yup.string().required("date is required"),
  givenEmplyeeDataForm: yup.string().required("selection is required"),
  dateGivenEmplyeeDataForm: yup.string().required("date is required"),
  givenHmoRefereeAndGuarantorForm: yup
    .string()
    .required("selection is required"),
  dateGivenHmoRefereeAndGuarantorForm: yup
    .string()
    .required("date is required"),
  laptop: yup.string().required("selection is required"),
  laptopDate: yup.string().required("date is required"),
  officeSpace: yup.string().required("selection is required"),
  officeSpaceDate: yup.string().required("date is required"),
  orientation: yup.string().required("selection is required"),
  orientationDate: yup.string().required("date is required"),
  orientationImpact: yup.string().required("selection is required"),
  impact: yup.string().when("orientationImpact", {
    is: "true",
    then: (schema) => schema.required("description is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  employeeHandBook: yup.string().required("selection is required"),
  employeeHandBookDate: yup.string().required("date is required"),
});
