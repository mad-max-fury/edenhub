import { createSlice, PayloadAction } from "@reduxjs/toolkit";



import { IAcademicBackgroundFormData, IBankDetailsFormData, IDependantsFormData, IEmergencyContactsFormData, IEmploymentHistoryFormData, INextOfKinFormData, IPersonalInformationFormData } from "@/app/staff/onboarding/bio-data/components";
import { IProfessionalQualificationFormData } from "@/app/staff/onboarding/bio-data/components/ProfessionalQualificationForm";
import { ITrainingCertificationFormData } from "@/app/staff/onboarding/bio-data/components/TrainingCertificationForm";



import { IBioDataProps, ITaxPensionsProps } from "./interface";


interface FormState {
  employeeId: string | null;
  staffId: string | null;
  profilePicture: string | null;
  personalInformation: IPersonalInformationFormData<string> | null;
  dependants: IDependantsFormData | null;
  emergencyContacts: IEmergencyContactsFormData | null;
  bankDetails: IBankDetailsFormData | null;
  nextOfKin: INextOfKinFormData | null;
  employmentHistory: IEmploymentHistoryFormData | null;
  academicBackground: IAcademicBackgroundFormData | null;
  professionalQualification: IProfessionalQualificationFormData | null;
  trainingCertification: ITrainingCertificationFormData | null;
  taxPensions: ITaxPensionsProps | null;
  employee?: {
    fullName?: string;
    email?: string;
    staffId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
}

const initialState: FormState = {
  employeeId: null,
  staffId: null,
  personalInformation: null,
  profilePicture: null,
  dependants: null,
  emergencyContacts: null,
  nextOfKin: null,
  employmentHistory: null,
  academicBackground: null,
  professionalQualification: null,
  trainingCertification: null,
  bankDetails: null,
  taxPensions: null,
};

const bioDataFormSlice = createSlice({
  name: "bio-data",
  initialState,
  reducers: {
    setBioProfilePicture: (state, action: PayloadAction<string | null>) => {
      state.profilePicture = action.payload;
    },
    setPersonalInformation: (
      state,
      action: PayloadAction<IPersonalInformationFormData<string>>,
    ) => {
      state.personalInformation = action.payload;
    },
    setDependants: (state, action: PayloadAction<IDependantsFormData>) => {
      state.dependants = action.payload;
    },
    setEmergencyContacts: (
      state,
      action: PayloadAction<IEmergencyContactsFormData>,
    ) => {
      state.emergencyContacts = action.payload;
    },
    setNextOfKin: (state, action: PayloadAction<INextOfKinFormData>) => {
      state.nextOfKin = action.payload;
    },
    setAcademicBackground: (
      state,
      action: PayloadAction<IAcademicBackgroundFormData>,
    ) => {
      state.academicBackground = action.payload;
    },
    setEmploymentHistory: (
      state,
      action: PayloadAction<IEmploymentHistoryFormData>,
    ) => {
      state.employmentHistory = action.payload;
    },
    setProfessionalQualification: (
      state,
      action: PayloadAction<IProfessionalQualificationFormData>,
    ) => {
      state.professionalQualification = action.payload;
    },
    setTrainingCertification: (
      state,
      action: PayloadAction<ITrainingCertificationFormData>,
    ) => {
      state.trainingCertification = action.payload;
    },
    setTaxPensions: (state, action: PayloadAction<ITaxPensionsProps>) => {
      state.taxPensions = action.payload;
    },

    setBioDataEmployeeId: (state, action: PayloadAction<string>) => {
      state.employeeId = action.payload;
    },
    setStaffId: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.staffId = action.payload;
    },

    setBankDetails: (state, action: PayloadAction<IBankDetailsFormData>) => {
      state.bankDetails = action.payload;
    },
    initBioData: (state, action: PayloadAction<IBioDataProps>) => {
      const {
        basicInformation,
        staffId,
        employeeDependent,
        employeeEmergencyContact,
        employeeBankDetails,
        employeeNextOfKin,
        employeeEmploymenHistory,
        employeeAcademicBackground,
        employeeProfessionaQualification,
        employeeTrainingCertificate,
        employeeTaxAndPension,
      } = action.payload;

      if (basicInformation.dateOfBirth) {
        state.employee = {
          fullName: basicInformation?.fullname ?? "",
          email: basicInformation.email || "",
          staffId: basicInformation.enrollmentId || "",
          firstName: basicInformation.firstname || "",
          middleName: basicInformation.middlename || "",
          lastName: basicInformation.lastname || "",
        };
        state.profilePicture = basicInformation.profilePicture || null;
        state.staffId = staffId || null;
        state.personalInformation = {
          phoneNumber: basicInformation.phoneNumber || "",
          address: basicInformation.address || "",
          dateOfBirth: basicInformation.dateOfBirth || "",
          alternatePhoneNumber: basicInformation.alternatePhoneNumber || "",
          genderId: String(basicInformation.genderId),
          maritalStatusId: String(basicInformation.maritalStatusId),
          marriageCertificate: basicInformation.marriageCertificate || "",
          countryId: {
            value: basicInformation.countryId,
            label: basicInformation.country,
          },
          stateId: {
            value: basicInformation.stateId,
            label: basicInformation.state,
          },
          lgaId: {
            value: basicInformation.lgaId,
            label: basicInformation.lga,
          },
          religionId: {
            value: String(basicInformation.religionId),
            label: basicInformation.religion,
          },
        };
      }
      if (employeeDependent?.length > 0) {
        state.dependants = {
          dependants: employeeDependent?.map((item) => {
            return {
              ...item,
              genderId: String(item.genderId),
              relationshipId: {
                value: String(item.relationshipId),
                label: item.relationship,
              },
            };
          }),
        };
      }
      if (employeeEmergencyContact?.firstname) {
        state.emergencyContacts = {
          firstname: employeeEmergencyContact.firstname || "",
          lastname: employeeEmergencyContact.lastname || "",
          middlename: employeeEmergencyContact.middlename || "",
          address: employeeEmergencyContact.address || "",
          phoneNumber: employeeEmergencyContact.phoneNumber || "",
          email: employeeEmergencyContact.email || "",
          relationshipId: {
            value: String(employeeEmergencyContact.relationshipId),
            label: employeeEmergencyContact.relationship,
          },
        };
      }
      if (employeeBankDetails?.accountName) {
        state.bankDetails = {
          bankId: {
            value: String(employeeBankDetails.bankId),
            label: String(employeeBankDetails.bankName),
          },
          accountName: employeeBankDetails.accountName,
          accountNumber: String(employeeBankDetails.accountNumber),
        };
      }
      if (employeeNextOfKin?.firstname) {
        state.nextOfKin = {
          firstname: employeeNextOfKin.firstname || "",
          lastname: employeeNextOfKin.lastname || "",
          middlename: employeeNextOfKin.middlename || "",
          address: employeeNextOfKin.address || "",
          phoneNumber: employeeNextOfKin.phoneNumber || "",
          email: employeeNextOfKin.email || "",
          relationshipId: {
            value: String(employeeNextOfKin.relationshipId),
            label: employeeNextOfKin.relationship,
          },
        };
      }
      if (employeeEmploymenHistory?.length > 0) {
        state.employmentHistory = {
          employmentHistory: employeeEmploymenHistory,
        };
      }
      if (employeeAcademicBackground.length > 0) {
        state.academicBackground = {
          academicBackground: employeeAcademicBackground.map((item) => {
            return {
              ...item,
              qualificationId: {
                value: String(item.qualificationId),
                label: item.qualification,
              },
              certificate: null,
            };
          }),
        };
      }
      if (employeeProfessionaQualification.length > 0) {
        state.professionalQualification = {
          professionalQualification: employeeProfessionaQualification.map(
            (item) => ({ ...item, certificate: null }),
          ),
        };
      }
      if (employeeProfessionaQualification.length > 0) {
        state.professionalQualification = {
          professionalQualification: employeeProfessionaQualification.map(
            (item) => ({ ...item, certificate: null }),
          ),
        };
      }
      if (employeeTrainingCertificate.length > 0) {
        state.trainingCertification = {
          trainingCertification: employeeTrainingCertificate.map((item) => ({
            ...item,
            certificate: null,
          })),
        };
      }
      if (employeeTaxAndPension?.fundsAdministratorId) {
        state.taxPensions = {
          taxId: employeeTaxAndPension.taxId || "",
          fundsAdministratorId: {
            value: String(employeeTaxAndPension.fundsAdministratorId),
            label: employeeTaxAndPension.fundsAdministrator,
          },
          pensionPin: employeeTaxAndPension.pensionPin || "",
        };
      }
    },

    resetState: (state) => {
      state.personalInformation = null;
      state.staffId = null;
      state.profilePicture = null;
      state.employeeId = null;
      state.dependants = null;
      state.nextOfKin = null;
      state.emergencyContacts = null;
      state.employmentHistory = null;
      state.nextOfKin = null;
      state.academicBackground = null;
      state.professionalQualification = null;
      state.bankDetails = null;
      state.trainingCertification = null;
      state.taxPensions = null;
    },
  },
});

export const {
  setPersonalInformation,
  setDependants,
  resetState,
  setAcademicBackground,
  setEmergencyContacts,
  setEmploymentHistory,
  setNextOfKin,
  setProfessionalQualification,
  setTrainingCertification,
  setTaxPensions,
  setBioDataEmployeeId,
  setStaffId,
  setBioProfilePicture,
  setBankDetails,
  initBioData,
} = bioDataFormSlice.actions;
export default bioDataFormSlice.reducer;