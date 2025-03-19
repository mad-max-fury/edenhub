import { IPaginationResponse } from "../interface";

export interface ICompanyProps {
  id: string;
  name: string;
  code: string;
  departments: number;
  businessUnits: number;
  location: null;
  employees: number;
}

export interface ICompanyByLocationProps {
  id: string;
  name: string;
  description: string;
  formUrl: string;
}

export interface IPaginatedCompaniesResponse {
  metaData: IPaginationResponse;
  items: ICompanyProps[];
}

export interface ICreateCompayPayload {
  name: string;
  code: string;
}

export interface IEditCompayPayload extends ICreateCompayPayload {
  id: string;
}
