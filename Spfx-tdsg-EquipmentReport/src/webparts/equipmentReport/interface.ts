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
  EquipmentImprovementId?:number;
  When: string;
  MachineName: string;
  SubMachineName:number[]
  Purpose: string;
  CurrentSituation: string;
  ImprovementName:string;
  Improvement: string;
  sectionId:string;
  IsSubmit:boolean;
  TargetDate:string;
  ActualDate:string;
  CreatedDate:string;
  CreatedBy:number;
  ModifiedBy:number;
  sectionHeadId:number;
  IsDeleted:boolean;
  EquipmentCurrSituationAttachmentDetails:ICurrentSituationAttachments[];
  EquipmentImprovementAttachmentDetails:IImprovementAttachments[];
  ChangeRiskManagementDetails:IChangeRiskData[];
  // attachment: File;
}

export interface ICurrentSituationAttachments{
  EquipmentCurrSituationAttachmentId:number;
  EquipmentImprovementId:number;
  CurrSituationDocName:string;
  CurrSituationDocFilePath:string;
  CreatedBy?:number;
  ModifiedBy?:number;
}
export interface IImprovementAttachments{
  EquipmentImprovementAttachmentId:number;
  EquipmentImprovementId:number;
  ImprovementDocName:string;
  ImprovementDocFilePath:string;
  CreatedBy:number;
  ModifiedBy:number;
}
export interface IChangeRiskData {
  key:number;
  Changes: string;
  FunctionId : number;
  RiskAssociated : string;
  Factor : string;
  CounterMeasures : string;
  DueDate : string;
  PersonInCharge :string;
  Results :string
}

export type ObjectType = { [key: string]: string | number | undefined };



export interface ICustomAxiosConfig extends AxiosRequestConfig<any> {
  SHOW_NOTIFICATION?: boolean;
}

export default{

}