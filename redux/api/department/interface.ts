import { IPaginationResponse } from "../interface";

export interface IDepartmentProps {
  id: string;
  name: string;
  code: string;
  company: string;
  employees: number;
}

export interface IPaginatedDepartmentsResponse {
  metaData: IPaginationResponse;
  items: IDepartmentProps[];
}

export interface ICreateDepartmentPayload {
  name: string;
  code: string;
}

export interface IEditDepartmentPayload extends ICreateDepartmentPayload {
  id: string;
}
