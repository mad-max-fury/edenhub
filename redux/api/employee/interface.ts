import { IGetEmployeeDirectoryItem } from "@/app/staff/employee-management/all-employee/components";
import { IEmployeeProps } from "@/app/staff/employee-management/enrollment/components";
import {
  IBankDetailsFormData,
  IEmergencyContactsFormData,
} from "@/app/staff/onboarding/bio-data/components";

import { IPaginationQuery } from "../interface";

export interface IGetEmployeeEnrollmentListResponse {
  metaData: MetaData;
  items: IEmployeeProps[];
}

export interface IGetEmployeeDirectoryResponse {
  metaData: MetaData;
  items: IGetEmployeeDirectoryItem[];
}
export interface IGetEmployeeEmploymentInfoResponse extends EmployeeBioData {}
export interface MetaData {
  pageSize: number;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface IGetEmployeeEnrollmentListRequest {
  statusId: string;
  departmentId: string;
  companyId: string;
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  newUsers: "true" | "false";
}

export interface IApproveOrReject {
  employeeId: string;
  status: boolean;
  comment?: string;
  userId?: string;
}

export interface IGetEmployeeDirectoryRequest {
  statusId: string;
  departmentId: string;
  companyId: string;
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
}

export interface IGetEmployeeEnrollmentRes {
  adminEnrollmentStatus: string;
  adminEnrollmentCompleted: boolean;
  employmentType: EmploymentType;
  employmentDetails: EmploymentDetails;
  employeeBioData: EmployeeBioData;
  userDocuments: UserDocuments;
  employeeAttestationForm: EmployeeAttestationForm;
  employeeReferenceForm: EmployeeReferenceForm;
  employeeGuarantorForm: EmployeeGuarantorForm3;
  employeeIntegrationForm: EmployeeIntegrationForm;
  employeeDocuments: EmployeeDocuments;
  requiredDocuments: RequiredDocument[];
  requiredForms: RequiredForm[];
}

export interface EmployeeGuarantorForm {
  guarantorForm: string;
}

export interface GuarantorForm {
  approved: "Pending" | "Approved" | "Rejected";
  completed: boolean;
  dateSubmitted: string;
  dateUpdated: string;
  description: string;
  employeeGuarantorForm: EmployeeGuarantorForm[];
  formId: number;
  title: string;
}

export interface Props {
  idCardData: unknown;
  employeeData: IGetEmployeeEnrollmentRes;
}

export interface EmploymentType {
  employmentTypeId: string;
  employmentType: string;
}

export interface EmploymentDetails {
  jobTitle: string;
  jobTitleId: string;
  jobDesignationId: string;
  jobDesignation: string;
  companyId: string;
  company: string;
  workLocationId: string;
  workLocation: string;
  businessUnitId: string;
  businessUnit: string;
  departmentId: string;
  department: string;
  hireDate: string;
  leaveDays: number;
}

export interface IDependantProps {
  name?: string;
  genderId?: string;
  dateOfBirth?: string;
  relationshipId: {
    label?: string;
    value?: string;
  };
}

export interface IEmploymentHistoryProps {
  position?: string;
  organisation?: string;
  from: string;
  to: string;
}

export interface IAcademicBackgroundProps<T = File | null> {
  school?: string;
  major?: string;
  qualificationId: {
    label?: string;
    value?: string;
  };
  from?: string;
  to?: string;
  certificate?: T;
}

export interface IAcademicBackgroundResponseProps {
  school: string;
  major: string;
  qualificationId: string;
  qualification: string;
  from: string;
  to: string;
  certificate: string;
}

export interface IProfessionalQualificationProps {
  institution?: string;
  qualification?: string;
  from?: string;
  to?: string;
  certificate?: File | null;
}

export interface ITrainingCertificationProps {
  name?: string;
  institution?: string;
  location?: string;
  to?: string;
  certificate?: File | null;
}

export interface ITaxPensionsProps {
  taxId?: string;
  fundsAdministratorId: {
    label?: string;
    value?: string;
  };
  pensionPin?: string;
  NHS?: string;
}
export interface ITaxPensionsResponseProps {
  taxId: string;
  fundsAdministrator: string;
  fundsAdministratorId: string;
  pensionPin: string;
  nhs?: string;
}

export interface BankDetailsProps {
  accountName: string;
  accountNumber: number;
  bankCode: string;
  bankId: number;
  bankName: string;
  id: string;
}

export interface EmployeeBioData {
  completed: boolean;
  approved: boolean;
  staffId: string;
  title: string;
  description: string;
  basicInformation: BasicInformation;
  employeeEmergencyContact: EmployeeEmergencyContact;
  employeeNextOfKin: EmployeeNextOfKin;
  employeeDependent: IDependantResponseProps[];
  employeeEmploymentHistory: EmployeeEmploymentHistory[];
  employeeBankDetails: BankDetailsProps;
  employeeAcademicBackground: IAcademicBackgroundResponseProps[];
  employeeProfessionalQualification: EmployeeProfessionalQualification[];
  employeeProfessionaQualification: IProfessionalQualificationProps[];
  employeeTrainingCertificate: ITrainingCertificationApi[];
  employeeTaxAndPension: ITaxPensionsProps;
}
export interface BasicInformation {
  bioDataFormCompleted: boolean;
  active: boolean;
  approved: boolean;
  userId: string;
  employeeId: string;
  enrollmentId: string;
  fullname: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  profilePicture: string;
  marriageCertificate: string;
  passportUrl: string;
  signatureUrl: string;
  address: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  countryId: number;
  country: string;
  stateId: number;
  state: string;
  lgaId: number;
  lga: string;
  religionId: number;
  religion: string;
  dateOfBirth: string;
  genderId: number;
  gender: string;
  maritalStatusId: number;
  maritalStatus: string;
}

export interface EmployeeEmergencyContact {
  lastname: string;
  firstname: string;
  middlename: string;
  address: string;
  email: string;
  phoneNumber: string;
  tickedConsent: boolean;
  completed: boolean;
  relationshipId: number;
  relationship: string;
}

export interface EmployeeNextOfKin {
  lastname: string;
  firstname: string;
  middlename: string;
  address: string;
  email: string;
  phoneNumber: string;
  tickedConsent: boolean;
  completed: boolean;
  relationshipId: number;
  relationship: string;
}

export interface IEmployeeTaxAndPension {
  taxId: string;
  fundsAdministratorId: number;
  fundsAdministrator: string;
  pensionPin: string;
  completed: boolean;
}

export interface EmployeeEmploymentHistory {
  position: string;
  organisation: string;
  qualification: string;
  location: string;
  institution: string;
  certificate: string;
  name: string;
  from: string;
  to: string;
  completed: boolean;
  approved: boolean;
}

export interface IEmployeeAcademicBackgroundResponse {
  school: string;
  major: string;
  qualificationId: number;
  from: string;
  to: string;
  certificate: string;
  completed: boolean;
  approved: boolean;
}

export interface EmployeeProfessionalQualification {
  position: string;
  organisation: string;
  qualification: string;
  location: string;
  institution: string;
  certificate: string;
  name: string;
  from: string;
  to: string;
  completed: boolean;
  approved: boolean;
}

export interface EmployeeTrainingCertificate {
  position: string;
  organisation: string;
  qualification: string;
  location: string;
  institution: string;
  certificate: string;
  name: string;
  from: string;
  to: string;
  completed: boolean;
  approved: boolean;
}

export interface UserDocuments {
  idCardFormTitle: string;
  idCardFormDescription: string;
  documentsTitle: string;
  documentsDescription: string;
  passport: string;
  profilePicture: string;
  marriageCertificate: string;
  signature: string;
  nycs: string;
  identification: string;
  cv: string;
  equipment: string;
  completed: boolean;
  approved: boolean;
}

export interface EmployeeAttestationForm {
  attestationFormTitle: string;
  attestationFormDescription: string;
  guarantorFormTitle: string;
  guarantorFormDescription: string;
  referenceFormTitle: string;
  referenceFormDescription: string;
  completed: boolean;
  approved: boolean;
  referenceForm: string;
  employeeGuarantorForm: EmployeeGuarantorForm[];
  dateSubmitted: string;
}

export interface EmployeeGuarantorForm {
  guarantorForm: string;
}

export interface EmployeeReferenceForm {
  attestationFormTitle: string;
  attestationFormDescription: string;
  guarantorFormTitle: string;
  guarantorFormDescription: string;
  referenceFormTitle: string;
  referenceFormDescription: string;
  completed: boolean;
  approved: boolean;
  referenceForm: string;
  employeeGuarantorForm: EmployeeGuarantorForm2[];
}

export interface EmployeeGuarantorForm2 {
  guarantorForm: string;
}

export interface EmployeeGuarantorForm3 {
  attestationFormTitle: string;
  attestationFormDescription: string;
  guarantorFormTitle: string;
  guarantorFormDescription: string;
  referenceFormTitle: string;
  referenceFormDescription: string;
  completed: boolean;
  approved: boolean;
  referenceForm: string;
  employeeGuarantorForm: EmployeeGuarantorForm4[];
}

export interface EmployeeGuarantorForm4 {
  guarantorForm: string;
}

export interface EmployeeIntegrationForm {
  title: string;
  description: string;
  introducedToEveryone: boolean;
  dateIntroducedToEveryone: string;
  givenEmployeeDataForm: boolean;
  dateGivenEmployeeDataForm: string;
  givenHmoRefereeAndGuarantorForm: boolean;
  dateGivenHmoRefereeAndGuarantorForm: string;
  laptop: boolean;
  laptopDate: string;
  officeSpace: boolean;
  officeSpaceDate: string;
  orientation: boolean;
  orientationDate: string;
  orientationImpact: boolean;
  impact: string;
  employeeHandBook: boolean;
  employeeHandBookDate: string;
  completed: boolean;
  approved: boolean;
}

export interface EmployeeDocuments {
  idCardFormTitle: string;
  idCardFormDescription: string;
  documentsTitle: string;
  documentsDescription: string;
  passport: string;
  profilePicture: string;
  marriageCertificate: string;
  signature: string;
  nycs: string;
  identification: string;
  cv: string;
  equipment: string;
  completed: boolean;
  approved: boolean;
}

export interface RequiredDocument {
  requiredDocumentId: string;
  requiredDocument: string;
}

export interface RequiredForm {
  requiredFormId: string;
  requiredForm: string;
}

export interface IOnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  taskId: number;
  approved: string;
  formDetails:
    | IBioDataProps
    | IIDCardProps
    | IAttestationProps
    | IDocumentResponse;
}
export interface IPersonalInfoProps {
  bioDataFormCompleted: boolean;
  userId: string;
  employeeId: string;
  enrollmentId: string | null;
  fullname: string;
  firstname: string;
  middlename: string | null;
  lastname: string;
  email: string;
  profilePicture: string | null;
  marriageCertificate: string | null;
  passportUrl: string | null;
  signatureUrl: string | null;
  address: string | null;
  phoneNumber: string | null;
  alternatePhoneNumber: string | null;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  lgaId: string;
  lga: string;
  religionId: number;
  religion: string;
  dateOfBirth: string;
  genderId: number;
  gender: string;
  maritalStatusId: number;
  maritalStatus: string;
}
export interface IDependantResponseProps {
  name: string;
  genderId: string;
  gender: string;
  dateOfBirth: string;
  relationshipId: string;
  relationship: string;
  completed: boolean;
}

export interface IEmergencyContactsResponseProps {
  lastname: string;
  firstname: string;
  middlename: string;
  address: string;
  email: string;
  phoneNumber: string;
  tickedConsent: boolean;
  completed: boolean;
  relationshipId: string;
  relationship: string;
}
export interface IBankDetailsResponse {
  employeeId: string;
  bankId: number;
  oldUser?: boolean;
  accountNumber: string;
  accountName: string;
}

export interface INextOfKinFormResponseProps {
  lastname: string;
  firstname: string;
  middlename: string;
  address: string;
  email: string;
  phoneNumber: string;
  tickedConsent: boolean;
  completed: boolean;
  relationshipId: string;
  relationship: string;
}
export interface IDependantsApi
  extends Omit<IDependantProps, "relationshipId"> {
  relationshipId: string;
  employeeId: string;
}

export interface IAcademicBackgroundApi
  extends Omit<IAcademicBackgroundProps, "qualificationId" | "certificate"> {
  qualificationId: string;
  certificate: string;
  employeeId: string;
}
export interface IProfessionalQualificationApi
  extends Omit<IProfessionalQualificationProps, "certificate"> {
  certificate: string;
  employeeId: string;
}
export interface ITrainingCertificationApi
  extends Omit<ITrainingCertificationProps, "certificate"> {
  certificate: string;
  employeeId: string;
}
export interface IBioDataProps {
  staffId: string;
  basicInformation: IPersonalInfoProps;
  employeeDependent: IDependantResponseProps[];
  employeeEmergencyContact: IEmergencyContactsResponseProps;
  bankDetails: IBankDetailsFormData;
  employeeNextOfKin: INextOfKinFormResponseProps;
  employeeEmploymenHistory: IEmploymentHistoryProps[];
  employeeAcademicBackground: IAcademicBackgroundResponseProps[];
  employeeProfessionaQualification: IProfessionalQualificationProps[];
  employeeTrainingCertificate: ITrainingCertificationApi[];
  employeeTaxAndPension: ITaxPensionsResponseProps;
  employeeBankDetails: BankDetailsProps;
}

export interface IDependantsApi
  extends Omit<IDependantProps, "relationshipId"> {
  relationshipId: string;
  employeeId: string;
}

export interface IDependantsApiPayload {
  employeeId: string;
  employeeDependent: IDependantsApi[];
}

export interface IWorkHistoryApiPayload {
  employeeId: string;
  workHistory: IEmploymentHistoryProps[];
}

export interface IDependantsApiPayload {
  employeeId: string;
  employeeDependent: IDependantsApi[];
}
export interface IEmergencyContactApi
  extends Omit<IEmergencyContactsFormData, "relationshipId"> {
  relationshipId: string;
}
export interface IEmergencyContactPayload extends IEmergencyContactApi {
  employeeId: string;
}

export interface INextOfKinPayload extends IEmergencyContactPayload {}

export interface IAcademicBackgroundPayload {
  employeeId: string;
  academicBackground: IAcademicBackgroundApi[];
}

export interface IAcademicBackgroundStateProps {
  academicBackground: IAcademicBackgroundProps<string>[];
}
export interface IProfessionalQualificatioPayload {
  employeeId: string;
  workHistory: IProfessionalQualificationApi[];
}
export interface ITrainingCertificationPayload {
  employeeId: string;
  workHistory: ITrainingCertificationApi[];
}

interface ITaxAndPensionsApi
  extends Omit<ITaxPensionsProps, "fundsAdministratorId"> {
  fundsAdministratorId: number | null;
}

export interface ITaxAndPensionsPayload {
  employeeTaxAndPension?: ITaxAndPensionsApi;
  employeeId: string;
  oldUser: boolean;
}

export interface IIDCardProps {
  passport: string;
  signature: string;
}
export interface IAttestationProps {
  completed: string;
}

export interface IAttestationPayload {
  employeeId: string;
  signed: boolean;
}
export interface IIntegrationFormData<T = string> {
  introducedToEveryone: T;
  dateIntroducedToEveryone: string;
  givenEmplyeeDataForm: T;
  dateGivenEmplyeeDataForm: string;
  givenHmoRefereeAndGuarantorForm: T;
  dateGivenHmoRefereeAndGuarantorForm: string;
  laptop: T;
  laptopDate: string;
  officeSpace: T;
  officeSpaceDate: string;
  orientation: T;
  orientationDate: string;
  orientationImpact: T;
  impact?: string;
  employeeHandBook: T;
  employeeHandBookDate: string;
}

export interface IEmployeeIntegrationFormPayload
  extends IIntegrationFormData<boolean> {
  employeeId: string;
}

export interface IDocumentProps {
  requiredDocument: string;
  requiredDocumentId: string;
  file: string;
}

export interface IDocumentResponse {
  approved: string;
  employeeDocuments: IDocumentProps[];
}

export interface IFormTemplateResponse {
  id: string;
  name: string;
  description: null;
  formUrl: string;
}

export interface IGetEmployeeLeavesRequest extends IPaginationQuery {
  statusId: string;
  yearId: string;
  leaveTypeId: string;
  employeeId?: string;
  companyId?: string;
  departmentId?: string;
}

export interface IStaffCountResponse {
  fullStaff: number;
  inHouseContract: number;
  outsourcedContract: number;
  nysc: number;
  intern: number;
  total: number;
}

export interface IEmployeeDocuments {
  personalDocuments: IDocumentListItem[];
  academicDocuments: IDocumentListItem[];
  professionalQualifications: IDocumentListItem[];
  trainingCertificates: IDocumentListItem[];
}

export interface PersonalDocuments {
  passport: string | null;
  signature: string | null;
  marriageCertificate: string | null;
}
export interface IUpdaterStaffIDProps {
  userId: string;
  newStaffId: string;
}

export interface IDocumentListItem {
  documentUrl: string;
  name: string;
}
