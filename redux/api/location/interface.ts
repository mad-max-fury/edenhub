import { ICompanyProps } from "../company";
import { IPaginationResponse } from "../interface";

export interface ILocationProps {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  countryId: number;
  stateId: number;
  cityId: number;
  code: string;
  address: string;
  staff: number;
  companies: Partial<ICompanyProps>[];
}
export interface IPaginatedLocationsResponse {
  metaData: IPaginationResponse;
  items: ILocationProps[];
}

export interface ICreateLocationPayload {
  name: string;
  code: string;
  companyId: string[];
  countryId: string;
  stateId: string;
  cityId?: string;
  address: string;
}

export interface IEditLocationPayload extends ICreateLocationPayload {
  id: string;
}
