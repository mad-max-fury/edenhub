import { IPaginationResponse } from "../interface";

export interface IJobDesignationProps {
  id: string;
  name: string;
  employees: number;
  leaveDays: string;
}

export interface IPaginatedJobDeignationsResponse {
  metaData: IPaginationResponse;
  items: IJobDesignationProps[];
}

export interface ICreateJobDesignationPayload {
  name: string;
  leaveDays: string;
}

export interface IEditJobDesignationPayload
  extends ICreateJobDesignationPayload {
  id: string;
}
