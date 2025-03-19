import { EnrollmentStatusType } from "../interface";

export interface IEmployeeDashboard {
  userId: string;
  employeeId: string;
  profilePicture: string;
  fullname: string;
  lastname: string;
  firstname: string;
  middleName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  company: string;
  department: string;
  businessUnit: string;
  jobTitle: string;
  jobDesignation: string; // Corrected from "JoibDesignation" to "jobDesignation"
  employmentType: string;
  location: string;
  hod: string;
  hiredDate: string;
  leaveDays: number;
  birthDay: string;
  workAnniversary: number;
  supervisors: string[];
  upcomingBirthDays: IBirthdayResponse[];
  employeeLeave: IEmployeeLeaveProps;
}

export interface IBirthdayResponse {
  firstname: string;
  lastname: string;
  company: string;
  birthDay: string;
  department: string;
  profilePicture: string;
}

export interface IWorkAnniversaryProps {
  firstname: string;
  lastname: string;
  company: string;
  department: string;
  workAnniversary: string;
  profilePicture: string;
  hiredDate: string;
}
export interface ILatestEnrorllmentProps {
  lastname: string;
  firstname: string;
  company: string;
  department: string;
  birthDay: null;
  date: string;
  hiredDate: null;
  status: EnrollmentStatusType;
  profilePicture: string;
}

export interface IHRDashboardProps {
  userId: string;
  employeeId: string | null;
  lastname: string;
  firstname: string;
  middleName: string | null;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber: null;
  profilePicture: string;
  employeeCounts: {
    male: number;
    female: number;
    total: number;
  };
  companies: {
    companies: number;
    departments: number;
    businessUnits: number;
    locations: number;
  };
  upcomingWorkAnniversaries: IWorkAnniversaryProps[];
  latestEnrollments: ILatestEnrorllmentProps[];
  upcomingBirthDays: IBirthdayResponse[];
}
export interface ILeaveStats {
  annualLeave: number;
  maternityLeave: number;
  sickLeave: number;
}
export interface IEmployeeLeaveProps {
  yearlyLeaveEntitlement: ILeaveStats;
  approvedRequests: ILeaveStats;
  availableLeaveDays: ILeaveStats;
  pendingRequests: ILeaveStats;
}
