import { ILeaveApprovalStatus, IPaginationResponse } from "../interface";


export interface ILeaveProps {
  leaveId: string;
  name: string;
  status: boolean;
  approval: boolean;
  numberOfDays: number;
  from: null | string;
  to: null | string;
  dateApplied: null | string;
  requiredDocument: boolean;
  document: null | string;
  leaveTypeId: number;
  leaveType?: string;
  leaveDaysOptionId: number;
  leaveDaysOption?: string;
  employeeLeaveId: string;
  staffId: string;
  employeeName: string;
  employeeEmail: string;
  leaveContactAddress: string;
  leavePhoneNumber: string;
  alternateContactPerson: string;
  alternateContactPersonAddress: string;
  alternateContactPersonEmail: string;
  hodId: string;
  hod: string;
  supervisorId: string;
  supervisor: string;
  reliefStaffId: string;
  reliefStaff: string;
  reason: string;
  payLeaveAllowance: boolean;
  ailmentType: string;
  confinementDate: string;
  leaveDocumentUrl: string;
  leaveDocumentType: string;
  company: string;
  department: string;
  profilePicture: string;
  yearId: number;
  year: string;
}

export interface IPaginatedLeaveTypesResponse {
  metaData: IPaginationResponse;
  items: ILeaveProps[];
}
export interface IPaginatedEmployeeLeavesResponse {
  metaData: IPaginationResponse;
  items: IGetEmployeeLeaveItem[];
}

export interface ICreateLeavePayload {
  id?: string;
  name: string;
  numberOfDays: number;
  requiredDocument: boolean;
  document?: string | null;
  leaveDaysOptionId: {
    label: string;
    value: string;
  };
  leaveTypeId: string;
}

export interface ICreateEmployeeLeavePayload {
  reliefStaffId: string;
  leaveId: string;
  supervisorId: string;
  hodId: string;
  employeeId: string;
  payLeaveAllowance: boolean;
}

export interface IGetEmployeeLeaveItem {
  leaveId: string;
  name: string;
  employeeName: string;
  employeeEmail: string;
  profilePicture: string;
  staffId: string;
  status: boolean;
  approval: ILeaveApprovalStatus;
  numberOfDays: number;
  from: string;
  to: string;
  dateApplied: string;
  requiredDocument: boolean;
  document: string;
  company: string;
  department: string;
  leaveContactAddress: string;
  leavePhoneNumber: string;
  alternateContactPerson: string;
  alternateContactPersonAddress: string;
  alternateContactPersonEmail: string;
  reliefStaff: string;
  reliefStaffId: string;
  hod: string;
  hodId: string;
  supervisor: string;
  supervisorId: string;
  leaveType: string;
  leaveTypeId: number;
  payLeaveAllowance: boolean;
}

export interface ISupervisorOrHODReposonse {
  hod: boolean;
  supervisor: boolean;
}

export interface IApproveOrRejectLeavePayload {
  leaveId: string;
  status?: boolean;
  reason?: string;
}