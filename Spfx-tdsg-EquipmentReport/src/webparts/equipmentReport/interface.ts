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

export  interface IEquipmentImprovementReport {
  when: string;
  deviceName: string;
  purpose: string;
  currentSituation: string;
  improvement: string;
  IsSubmit:boolean;
  CreatedBy:number;
  ModifiedBy:number;
  IsDeleted:boolean;
  EquipmentCurrSituationAttachmentDetails:IAttachments;
  EquipmentImprovementAttachmentDetails:IAttachments;
  ChangeRiskManagementDetails:IChangeRiskData;
  // attachment: File;
}

export interface IAttachments{
  id:string;
  fileName:string;
  filePath:string;
}
export interface IChangeRiskData {
  key:number;
  changes: string;
  functionId : number;
  riskAssociated : string;
  factor : string;
  counterMeasures : string;
  dueDate : string;
  personInCharge :string;
  results :string
}

export type ObjectType = { [key: string]: string | number | undefined };



export interface ICustomAxiosConfig extends AxiosRequestConfig<any> {
  SHOW_NOTIFICATION?: boolean;
}

export default{

}