import { IPaginationResponse } from "../interface";

export interface IJobTitleProps {
  id: string;
  name: string;
  employees: number;
}

export interface IPaginatedJobTitlesResponse {
  metaData: IPaginationResponse;
  items: IJobTitleProps[];
}

export interface ICreateJobTitlePayload {
  name: string;
}

export interface IEditJobTitlePayload extends ICreateJobTitlePayload {
  id: string;
}
