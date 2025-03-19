export interface ISelectResponse {
  id: string;
  name: string;
}
export interface IBank {
  bankId: number;
  bankName: string;
  bankSlug: string;
  bankCode: string;
  bankLogo: string;
  version: number;
  employeeBankDetails: null;
  active: boolean;
  createdAt: string;
  updatedAt: null | string;
}
