import { IPaginationQuery, IPaginationResponse } from "../interface";

export interface IMenuProps {
  id: string;
  name: string;
  claimCount: number;
  active: boolean;
}

export interface IPaginatedMenusResponse {
  metaData: IPaginationResponse;
  items: IMenuProps[];
}

export interface ICreateMenuPayload {
  name: string;
}

export interface IEditMenuPayload extends ICreateMenuPayload {
  menuId: string;
}

export interface IMenuClaimProp {
  name: string;
}
export interface IPaginatedMenuClaimsResponse {
  metaData: IPaginationResponse;
  items: IMenuClaimProp[];
}

export interface IMenuClaimsQuery extends IPaginationQuery {
  menuId: string;
}

export interface IDeleteMenuClaimsPayload {
  menuId: string;
  claim: string;
}

export interface IAddMenuToClaimPayload {
  menuId: string;
  claims: string[];
}
