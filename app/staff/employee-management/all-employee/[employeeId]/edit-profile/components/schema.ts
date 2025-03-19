import { checkForCorrectPhoneNumber } from "@/utils/formValidations";
import {
  checkIfFilesAreTooBig,
  checkIfImagesAreCorrectType,
} from "@/utils/helpers";
import * as yup from "yup";

export const personalDetailsSchema = yup.object().shape({
  address: yup.string().required("please enter an address"),
  dateOfBirth: yup.string().required("please enter date of birth"),
  phoneNumber: yup
    .string()
    .required("please enter a phone number")
    .test(
      "validate phone number",
      "invalid phone number",
      checkForCorrectPhoneNumber,
    ),
  alternatePhoneNumber: yup
    .string()
    .test(
      "validate phone number",
      "invalid phone number",
      (value: string | undefined) =>
        value ? checkForCorrectPhoneNumber(value) : true,
    ),
  maritalStatusId: yup.string().required("please select a marital status"),
  genderId: yup.string().required("please select a sex"),
  countryId: yup
    .object()
    .shape({
      label: yup.string().required("please select a country"),
      value: yup.string().required("please select a country"),
    })
    .required("please select a country"),
  stateId: yup
    .object()
    .shape({
      label: yup.string().required("please select a state"),
      value: yup.string().required("please select a state"),
    })
    .required("please select a state"),

  lgaId: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .when("$isLGAList", {
      is: true,
      then: (schema) => schema.required("Please select an LGA"),
      otherwise: (schema) => schema.nullable(),
    }),
  religionId: yup
    .object()
    .shape({
      label: yup.string().required("please select a religion"),
      value: yup.string().required("please select a religion"),
    })
    .required("please select a religion"),
  marriageCertificate: yup.mixed<File>().when("$isMarried", {
    is: true,
    then: (schema) =>
      schema
        .required("certificate is required")
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
});

const dependantSchema = yup.object().shape({
  relationshipId: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema.required("please select a relationship").shape({
          label: yup.string().required("please select a relationship"),
          value: yup.string().required("please select a relationship"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  name: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dateOfBirth: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("date of birth is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  genderId: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("gender is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const dependantsSchema = yup.object().shape({
  dependants: yup
    .array()
    .of(dependantSchema)
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "At least one dependant is required")
          .required("please enter details of a dependant"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const emergencyContactSchema = yup.object().shape({
  firstname: yup.string().trim().required("first name is required"),
  lastname: yup.string().trim().required("last name is required"),
  middlename: yup.string().trim(),
  address: yup.string().trim().required("address is required"),
  phoneNumber: yup
    .string()
    .required("please enter a phone number")
    .test(
      "validate phone number",
      "invalid phone number",
      checkForCorrectPhoneNumber,
    ),
  email: yup
    .string()
    .trim()
    .required("email is required")
    .email("must be a valid email address"),
  relationshipId: yup
    .object()
    .shape({
      label: yup.string().required("please select a relationship"),
      value: yup.string().required("please select a relationship"),
    })
    .required("please select a relationship"),
});

export const nextOfKinSchema = yup.object().shape({
  firstname: yup.string().trim().required("first name is required"),
  lastname: yup.string().trim().required("last name is required"),
  middlename: yup.string().trim(),
  address: yup.string().trim().required("address is required"),
  phoneNumber: yup
    .string()
    .required("please enter a phone number")
    .test(
      "validate phone number",
      "invalid phone number",
      checkForCorrectPhoneNumber,
    ),
  email: yup
    .string()
    .trim()
    .required("email is required")
    .email("must be a valid email address"),
  relationshipId: yup
    .object()
    .shape({
      label: yup.string().required("please select a relationship"),
      value: yup.string().required("please select a relationship"),
    })
    .required("please select a relationship"),
});

const employmentHistorySchema = yup.object().shape({
  position: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Position is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  organisation: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Organisation is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  from: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.number(),
    })
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema.required("From year is required").shape({
          label: yup.string().required("Please select a year"),
          value: yup.number().required("Please select a year"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  to: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.number(),
    })
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema.required("To year is required").shape({
          label: yup.string().required("Please select a year"),
          value: yup.number().required("Please select a year"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const employmentHistoriesSchema = yup.object().shape({
  employmentHistory: yup
    .array()
    .of(employmentHistorySchema)
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "At least one employment history is required")
          .required("Please enter details of a employment history"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const academicBackgroundSchema = yup.object().shape({
  school: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("school is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  major: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("major is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  from: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.number(),
    })
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema.required("From year is required").shape({
          label: yup.string().required("Please select a year"),
          value: yup.number().required("Please select a year"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  to: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.number(),
    })
    .when(["$hasChanges", "$checked"], {
      is: (hasChanges: boolean, checked: boolean) => hasChanges && !checked,
      then: (schema) =>
        schema.required("To year is required").shape({
          label: yup.string().required("Please select a year"),
          value: yup.number().required("Please select a year"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  qualificationId: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema.required("Please select a degree").shape({
          label: yup.string().required("Please select a degree"),
          value: yup.string().required("Please select a degree"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  certificate: yup
    .mixed<File>()
    .nullable()
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .required("Certificate is required")
          .test(
            "is-correct-file",
            "The file you selected is too big!",
            (value) => {
              const file = value as File;
              return file ? checkIfFilesAreTooBig(file) : false;
            },
          )
          .test(
            "is-big-file",
            "Wrong file type, ensure this is an image file!",
            (value) => {
              const file = value as File;
              return file ? checkIfImagesAreCorrectType(file) : false;
            },
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const academicBackgroundsSchema = yup.object().shape({
  academicBackground: yup
    .array()
    .of(academicBackgroundSchema)
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "At least one academic background is required")
          .required("Please enter details of an academic background"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const professionalQualificationSchema = yup.object().shape({
  institution: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Institution is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  qualification: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Qualification is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  from: yup.object().when("$hasChanges", {
    is: true,
    then: (schema) =>
      schema.required("From year is required").shape({
        label: yup.string().required("Please select a year"),
        value: yup.number().required("Please select a year"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  to: yup.object().when("$hasChanges", {
    is: true,
    then: (schema) =>
      schema.required("To year is required").shape({
        label: yup.string().required("Please select a year"),
        value: yup.number().required("Please select a year"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  certificate: yup
    .mixed<File>()
    .nullable()
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .required("Certificate is required")
          .test(
            "is-file-required",
            "Certificate is required",
            (value) => value !== null,
          )
          .test(
            "is-correct-file",
            "The file you selected is too big!",
            (value: File | null) => {
              return value ? checkIfFilesAreTooBig(value) : true;
            },
          )
          .test(
            "is-big-file",
            "Wrong file type, ensure this is an image file!",
            (value: File | null) =>
              value ? checkIfImagesAreCorrectType(value) : true,
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const professionalQualificationsSchema = yup.object().shape({
  professionalQualification: yup
    .array()
    .of(professionalQualificationSchema)
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "At least one professional qualification is required")
          .required("Please enter details of a professional qualification"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const trainingCertificationSchema = yup.object().shape({
  name: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Name of Certification is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  location: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Location is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  institution: yup.string().when("$hasChanges", {
    is: true,
    then: (schema) => schema.required("Institution is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  to: yup.object().when("$hasChanges", {
    is: true,
    then: (schema) =>
      schema.required("Year is required").shape({
        label: yup.string().required("Please select a year"),
        value: yup.number().required("Please select a year"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  certificate: yup
    .mixed<File>()
    .nullable() // Ensures compatibility with null values
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .required("Certificate is required")
          .test(
            "is-correct-file",
            "The file you selected is too big!",
            (value: File | null) => {
              return value ? checkIfFilesAreTooBig(value) : true;
            },
          )
          .test(
            "is-big-file",
            "Wrong file type, ensure this is an image file!",
            (value: File | null) => {
              return value ? checkIfImagesAreCorrectType(value) : true;
            },
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const trainingCertificationsSchema = yup.object().shape({
  trainingCertification: yup
    .array()
    .of(trainingCertificationSchema)
    .when("$hasChanges", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "At least one training certification is required")
          .required("Please enter details of a training certification"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
