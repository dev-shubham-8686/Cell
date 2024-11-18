import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";



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
  Status?:string;
  WorkflowStatus?:string;
  ActualDate:string;
  CreatedDate:string;
  CreatedBy:number;
  ModifiedBy:number;
  SectionHeadId?:number;
  AdvisorId?:number;
  IsDeleted:boolean;
  EquipmentCurrSituationAttachmentDetails:ICurrentSituationAttachments[];
  EquipmentImprovementAttachmentDetails:IImprovementAttachments[];
  PcrnAttachments:IPCRNAttchments;
  ChangeRiskManagementDetails:IChangeRiskData[];
  ToshibaApprovalRequired?:boolean;
  ToshibaApprovalTargetDate?:Date;
  ToshibaDiscussionTargetDate?:Date;
  ToshibaTeamDiscussion?:boolean;
  IsPcrnRequired?:boolean;
  ResultAfterImplementation?:IResultAfterImplementation  ;
  WorkflowLevel?:number;
  // attachment: File;
}

export interface IResultAfterImplementation {
  IsResultSubmit: boolean;
  ActualDate: string;
  TargetDate: string;
  ResultStatus:string;
  ResultMonitoring:string;
  ResultMonitoringDate:string;
  IsResultAmendSubmit?:boolean
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

export interface IPCRNAttchments{
  PcrnAttachmentId:number;
  EquipmentImprovementId:number;
  PcrnDocName:string;
  PcrnFilePath:string;
  CreatedBy:number;
  ModifiedBy:number;
  IsDeleted:boolean;
}
export interface IChangeRiskData {
  key:number;
  Changes: string;
  FunctionId : string;
  RiskAssociated : string;
  Factor : string;
  CounterMeasures : string;
  DueDate :  dayjs.Dayjs;
  PersonInCharge :number;
  Results :string
}

export type ObjectType = { [key: string]: string | number | undefined };



export interface ICustomAxiosConfig extends AxiosRequestConfig<any> {
  SHOW_NOTIFICATION?: boolean;
}

export default{

}