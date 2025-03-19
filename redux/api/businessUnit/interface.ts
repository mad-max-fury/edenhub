import { IDepartmentProps } from "../department";
import { IPaginationResponse } from "../interface";

export interface IBusinessUnitProps {
  id: string;
  name: string;
  companyId: string;
  company: string;
  description: string;
  employees: number;
  departments: IDepartmentProps[];
}
export interface IPaginatedBusinessUnitResponse {
  metaData: IPaginationResponse;
  items: IBusinessUnitProps[];
}

export interface ICreateBusinessUnitPayload {
  name: string;
  description: string;
  companyId: string;
  departmentId: string[];
}

export interface IEditBusinessUnitPayload extends ICreateBusinessUnitPayload {
  id: string;
}
