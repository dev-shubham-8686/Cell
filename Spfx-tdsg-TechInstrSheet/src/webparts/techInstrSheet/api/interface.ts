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
  isITSupportUser: boolean;
}

export type ObjectType = { [key: string]: string | number | undefined };

export interface IMaterialConsumptionSlipForm {
  items: {
    materialConsumptionSlipItemId?: number;
    categoryId?: number;
    materialId?: number;
    quantity: string;
    glCode: string;
    purpose: string;
    attachments: {
      materialConsumptionSlipItemAttachmentId?: number;
      name: string;
      url: string;
    }[];
  }[];
  employeeCode: string;
  remarks: string;
  userId: number;
  materialConsumptionSlipId?: number;
  createdDate?: string;
  requestor?: string;
  seqNumber: number;
  department?: string;
  materialConsumptionSlipNo?: string;
  isSubmit: boolean;
  isAmendReSubmitTask: boolean;
  status: string;
  cpcDeptHead: number;
}

export interface ICustomAxiosConfig extends AxiosRequestConfig<any> {
  SHOW_NOTIFICATION?: boolean;
}
