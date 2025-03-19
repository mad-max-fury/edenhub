import { Dispatch, SetStateAction } from "react";

export interface IPaginationQuery {
  pageNumber: number;
  pageSize: number;
  orderBy?: string;
  searchTerm?: string;
}

export interface IPaginationResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ITableProps<T> {
  tableData: T;
  setPageNumber: Dispatch<SetStateAction<number>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  loading: boolean;
}

export interface ISelectItemPropsWithValueGeneric {
  value: string | number;
  label: string;
}

export interface ISelectItemProps
  extends Omit<ISelectItemPropsWithValueGeneric, "value"> {
  value: string;
}
export type ILeaveApprovalStatus = "Approved" | "Pending" | "Rejected";
export type IAppraiserStatus = "Completed" | "In Progress" | "Un-appraised";
export type EnrollmentStatusType =
  | "Pending"
  | "Completed"
  | "Continue"
  | "Withdrawn"
  | "In Progress";
export type EnrollmentDocumentStatus =
  | "Approved"
  | "Rejected"
  | "Incomplete"
  | "Pending";

export enum AgeEnum {
  MINIMUM = 18,
  MAXIMUM = 80,
}

export enum OnboardingEnum {
  BIO_DATA = 1,
  ID_CARD = 2,
  ATTESTATION = 3,
  REFERENCE = 4,
  GUARANTORS = 5,
  INTEGRATION = 6,
  DOCUMENTS = 7,
  INFORMATION_UPDATE = 8,
}

export enum OnboardingDocEnum {
  CV = 1,
  NYSC_Certificate = 2,
  School_Certificate_Statement_of_Result = 3,
  Valid_Identification = 4,
  Equipment_Sign_Off_Form = 5,
}

export enum Assestation {
  EMPLOYEE_HANDBOOK = 2,
  CODE_OF_CONDUCT = 3,
}

export const ATTESTATION_DOCUMENT_ENUM = 13;
