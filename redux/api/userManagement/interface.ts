import { IPaginationQuery, IPaginationResponse } from "../interface";

export interface IUserResponse {
  userId: string;
  firstname: string;
  middlename: string;
  lastname: string;
  username: string;
  phoneNumber: string | null;
  email: string;
  genderId: number;
  gender: string;
  profilePicture: string | null;
  employeeId: string;
  userTypeId: number;
  jobTitle: string;
  jobTitleId: string;
  jobDesignation: string;
  jobDesignationId: string;
  company: string;
  companyId: string;
  department: string;
  departmentId: string;
  userType: string | null;
  role: string | null;
  status: string | null;
  staffId: string;
  menus: {
    claims: string[];
    menu: string;
  }[];
}

export interface IUserProps extends IUserResponse {
  company: string;
  department: string;
  claimCount: number;
}
export interface IAllUsersQuery extends IPaginationQuery {
  roleId?: string;
  companyId?: string;
  departmentId?: string;
}

export interface IPaginatedUsersResponse {
  metaData: IPaginationResponse;
  items: IUserProps[] | [];
}
