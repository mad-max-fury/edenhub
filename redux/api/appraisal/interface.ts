import { PAGE_SIZE } from "@/constants/data";

import { IPaginationResponse } from "../interface";

export interface ReviewType {
  id: string;
  name: string;
}

export interface Period {
  from: string;
  to: string;
}

export interface Duration {
  startDate: string;
  stopDate: string;
}

export interface Participants {
  include: string[];
  exclude: string[];
}

export interface IAppraisalCycleResponse {
  id: string;
  reviewType: ReviewType;
  name: string;
  description: string;
  period: Period;
  duration: Duration;
  isActive: boolean;
  isArchived: boolean | null;
  completed: boolean | null;
  year: number;
  participants: Participants;
  defaulters: null;
  status: null;
}

interface SubGroup {
  subGroupId: number;
  groupId: number;
  name: string;
  descriptions: string | null;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
}

interface IEmployee {
  employeeId: number;
  userId: string;
  staffId: string;
  email: string;
  subGroupId: number;
  fullName: string;
  name: string | null;
  phoneNumber: string | null;
  unitId: number;
  departmentId: number;
  isActive: boolean;
  subGroup: SubGroup;
}

interface Result {
  appraisalName: string | null;
  employeeId: number;
  employeeResult: number;
  appraiseeResult: number;
  softSkillResult: number;
  finalResult: number;
  annualAppraisalResult: string | null;
}

interface FinalResult {
  result: Result;
  id: number;
  exception: null;
  status: number;
}

export interface IAppraisalResultResponse {
  finalResult: FinalResult;
  employee: IEmployee;
}

export interface IHODOrSupervisorResponse {
  employeeId: number;
  userId: number | null;
  staffId: number | null;
  email: string;
  subGroupId: number;
  fullName: string | null;
  name: string;
  phoneNumber: string | null;
  unitId: number;
  departmentId: number;
  department: string;
  profilePicture: string;
  isActive: boolean;
  subGroup: string | null;
}

export interface IHODOrSupervisorQuery {
  empId: string;
  reviewId: string;
  year: number;
  whoami: string;
}

export interface IDirectReportsQuery {
  employeeId: string;
  reviewId: string;
  whoami: WHO_AM_I;
  pageNumber: number;
  pageSize: PAGE_SIZE;
  year: number;
}

export interface IDirectReportsResponse {
  employeeDetail: {
    employeeId: number;
    userId: number | null;
    profilePicture: string | null;
    department: string | null;
    staffId: string | null;
    email: string;
    subGroupId: number;
    fullName: string;
    name: string | null;
    phoneNumber: string | null;
    unitId: number;
    departmentId: number;
    isActive: boolean;
    subGroup: string | null;
  };
}

export interface IPaginatedDirectReportsResponse {
  directReport: IDirectReportsResponse[];
  pagination: IPaginationResponse;
}

export interface ICompanyYearlyResultProps {
  appraisalCycleId: string;
  appraisalName: string;
  averageFinalResult: number;
}

export interface IEmployeeYearlyAppraisalResults {
  appraisalName: string;
  employeeId: number;
  employeeResult: number;
  appraiseeResult: number;
  softSkillResult: number;
  finalResult: number;
  annualAppraisalResult: number | null;
}

export interface IEmployeeYearlyResultProps {
  appraisalName: string;
  employeeId: number;
  employeeResult: number;
  appraiseeResult: number;
  softSkillResult: number;
  status: boolean;
  duration: {
    startDate: string;
    stopDate: string;
  };
  periodInReview: {
    from: string;
    to: string;
  };
  finalResult: number;
  annualAppraisalResult: number | null;
}

export interface IEmployeeYearlyResultResponse {
  result: IEmployeeYearlyResultProps[];
  employee: IEmployee;
}

export enum WHO_AM_I {
  appraiser = "appraiser",
  hod = "hod",
}
