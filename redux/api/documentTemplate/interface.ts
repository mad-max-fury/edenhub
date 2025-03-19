import { IPaginationResponse } from "../interface";

export interface IDocumentTemplateProps {
  id: number;
  name: string;
  description: string;
  documentCategoryId: number;
  documentCategory: string;
  template: string;
  isCompleted: boolean;
  requiresSigning: boolean;
  requiresNotification: boolean;
  requiresUpload: boolean;
}

export interface IPaginatedDocumntTemplateResponse {
  metaData: IPaginationResponse;
  items: IDocumentTemplateProps[];
}

export interface ICreateDocumntTemplatePayload {
  id?: number;
  name: string;
  description: string;
  documentCategory: string;
  template: string;
  isCompleted: boolean;
  requiresSigning: boolean;
  requiresNotification: boolean;
  requiresUpload: boolean;
}
