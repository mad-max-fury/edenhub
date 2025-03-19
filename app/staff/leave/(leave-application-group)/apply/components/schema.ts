import {
  checkIfFilesAreTooBig,
  checkIfImagesAreCorrectType,
} from "@/utils/helpers";
import * as yup from "yup";

export const applyForLeaveFormValidationSchema = yup.object().shape({
  totalLeaveTaking: yup
    .number()
    .required("Total leave days is required")
    .typeError("Total leave days must be a valid number"),
  // .when("$leaveDays", {
  //   is: (leaveDays: number) => leaveDays !== undefined,
  //   then: (schema) =>
  //     schema.test({
  //       name: "max-leave",
  //       message: "Total leave cannot exceed available leave days",
  //       test: function (value) {
  //         const availableDays = this.parent.$leaveDays;
  //         return 2 <= availableDays;
  //       },
  //     }),
  // }),
  reliefStaffId: yup
    .object()
    .shape({
      label: yup.string().required("please select a releif staff"),
      value: yup.string().required("please select a releif staff"),
      icon: yup.string().required("please select a releif staff"),
      subLabel: yup.string().required("please select a releif staff"),
    })
    .required("please select a releif staff"),
  from: yup.string().required("from date is required"),
  to: yup.string().required("to date is required"),
  leaveContactAddress: yup
    .string()
    .required("leave contact address is required"),
  leavePhoneNumber: yup.string().required("leave phone number is required"),
  payLeaveAllowance: yup.string().required("pay leave allowance is required"),
  alternateContactPerson: yup
    .string()
    .required("alternate contact person  is required"),
  alternateContactPersonAddress: yup
    .string()
    .required("alternate contact person address is required"),
  alternateContactPersonPhoneNumber: yup
    .string()
    .required("alternate contact person phone number is required"),
  alternateContactPersonEmail: yup.string().optional(),
  leaveId: yup.object().shape({
    label: yup.string().required("please select a leave type"),
    value: yup.string().required("please select a leave type"),
  }),

  supervisorId: yup.object().shape({
    label: yup.string().required("please select a releif staff"),
    value: yup.string().required("please select a releif staff"),
    icon: yup.string().required("please select a releif staff"),
    subLabel: yup.string().required("please select a releif staff"),
  }),
  hodId: yup.object().shape({
    label: yup.string().required("please select a releif staff"),
    value: yup.string().required("please select a releif staff"),
    icon: yup.string().required("please select a releif staff"),
    subLabel: yup.string().required("please select a releif staff"),
  }),
  medicalCertificate: yup.mixed<File>().when("$isMedicalCertificate", {
    is: true,
    then: (schema) =>
      schema
        .required("Medical certificate is required")
        .test(
          "is-correct-file",
          "The file you selected is too big!",
          (value: File | null) =>
            value ? checkIfFilesAreTooBig(value) : false,
        )
        .test(
          "is-big-file",
          "Wrong file type, ensure this is an image file!",
          (value: File | null) =>
            value ? checkIfImagesAreCorrectType(value) : false,
        )
        .nullable(),
    otherwise: (schema) => schema.nullable(),
  }),
  sickCertificate: yup.mixed<File>().when("$isSickCertificate", {
    is: true,
    then: (schema) =>
      schema
        .required("Sick certificate is required")
        .test(
          "is-correct-file",
          "The file you selected is too big!",
          (value: File | null) =>
            value ? checkIfFilesAreTooBig(value) : false,
        )
        .test(
          "is-big-file",
          "Wrong file type, ensure this is an image file!",
          (value: File | null) =>
            value ? checkIfImagesAreCorrectType(value) : false,
        )
        .nullable(),
    otherwise: (schema) => schema.nullable(),
  }),
  examinationTimeTable: yup.mixed<File>().when("$isExaminationTimeTable", {
    is: true,
    then: (schema) =>
      schema
        .required("Examination timetable is required")
        .test(
          "is-correct-file",
          "The file you selected is too big!",
          (value: File | null) =>
            value ? checkIfFilesAreTooBig(value) : false,
        )
        .test(
          "is-big-file",
          "Wrong file type, ensure this is an image file!",
          (value: File | null) =>
            value ? checkIfImagesAreCorrectType(value) : false,
        )
        .nullable(),
    otherwise: (schema) => schema.nullable(),
  }),
  reason: yup.string(),
  ailmentType: yup.string(),
  confinementDate: yup.string(),
});
