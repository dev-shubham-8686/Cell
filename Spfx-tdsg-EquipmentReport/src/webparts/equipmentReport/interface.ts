import { AxiosRequestConfig } from "axios";

export interface IUser {
  employeeId: number;
  departmentId: number;
  departmentName: string;
  divisionId: number;
  divisionName: string;
  employeeCode: number;
  employeeName: string;
  email: string;
  empDesignation: string;
  mobileNo: string;
  departmentHeadEmpId: number;
  divisionHeadEmpId: number;
  costCenter: string;
  cMRoleId: number;
  isDivHeadUser: boolean;
  isAdmin: boolean;
  isAdminId: number;
}

export type ObjectType = { [key: string]: string | number | undefined };



export interface ICustomAxiosConfig extends AxiosRequestConfig<any> {
  SHOW_NOTIFICATION?: boolean;
}
