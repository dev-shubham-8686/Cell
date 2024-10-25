import { AxiosRequestConfig } from "axios";



export  interface IEquipmentImprovementReport {
  EquipmentImprovementId?:number;
  EquipmentImprovementNo?: string,
  AreaId:number,
  When: string;
  MachineName: string;
  SubMachineName:number[]
  Purpose: string;
  CurrentSituation: string;
  ImprovementName:string;
  Improvement: string;
  SectionId:string;
  IsSubmit:boolean;
  isAmendReSubmitTask?:boolean,
  TargetDate:string;
  Status?:String;
  ActualDate:string;
  CreatedDate:string;
  CreatedBy:number;
  ModifiedBy:number;
  SectionHeadId?:number;
  AdvisorId?:number;
  IsDeleted:boolean;
  EquipmentCurrSituationAttachmentDetails:ICurrentSituationAttachments[];
  EquipmentImprovementAttachmentDetails:IImprovementAttachments[];
  ChangeRiskManagementDetails:IChangeRiskData[];
  ToshibaApprovalRequired?:boolean;
  ToshibaApprovalTargetDate?:Date;
  ToshibaDiscussionTargetDate?:Date;
  ToshibaTeamDiscussion?:boolean;
  IsPcrnRequired?:boolean
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
  FunctionId : string;
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