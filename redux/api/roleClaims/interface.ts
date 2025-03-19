import { IPaginationResponse } from "../interface";

export interface IRolesProps {
  id: string;
  name: string;
  claimCount: number;
  active: boolean;
  employees: number;
}

export interface IPaginatedRolesResponse {
  metaData: IPaginationResponse;
  items: IRolesProps[];
}
export interface ICreateRoleProps {
  role: string;
  menus: {
    menu: string;
    claims: string[];
  }[];
}

export interface IEditRoleProps extends ICreateRoleProps {
  roleId: string;
}
export interface IPermissionsProps {
  name: string;
}

export interface IMenuClaimsProps {
  menu: string;
  menuId: string;
  claims: string[];
}

export interface IAddUserToRoleProps {
  userName: string;
  role: string;
}

export interface ICreatUserClaimProps {
  userId: string;
  menus: {
    menu: string;
    claims: string[];
  }[];
}
