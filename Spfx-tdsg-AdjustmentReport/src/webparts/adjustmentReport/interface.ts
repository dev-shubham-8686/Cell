export interface IAdjustmentReportPhoto {
  AdjustmentReportPhotoId: number;
  AdjustmentReportId: number;
  DocumentName: string;
  DocumentFilePath: string;
  IsOldPhoto: boolean;
  SequenceId: number;
  CreatedBy?: number;
  ModifiedBy?: number;
}

export interface IAdjustmentReportInfo {
  Key: number;
  AdjustmentReportId: number;
  ReportNo: string;
  CreatedDate: string;
  AreaName: string;
  MachineName: string;
  SubMachineName: string;
  Requestor: string;
  CurrentApprover: string;
  Status: string;
  IsSubmit: boolean;
  SectionHeadId: number;
  AdvisorId : number;
  EmployeeId: number;
}


export interface IWorkflowDetail {
  ApproverTaskId: number;
  FormType: string;
  AdjustmentReportId: number;
  AssignedToUserId: number;
  DelegateUserId: number;
  DelegateBy: number;
  Status: string;
  Role: string;
  DisplayName: string;
  SequenceNo: number;
  ActionTakenBy: number;
  ActionTakenDate: string;
  Comments: string;
  CreatedBy: number;
  CreatedDate: string;
  ModifiedBy: number;
  ModifiedDate: string;
  IsActive: boolean;
  employeeName: string;
  employeeNameWithoutCode: string;
  email: string;
}

export interface IAjaxResult {
  ResultType?: number;
  StatusCode?: number;
  Message: string;
  ReturnValue: any;
}

export interface IEmployee {
  employeeId: number;
  employeeName?: string;
  Email?: string;
}


export type ObjectType = { [key: string]: string | number | undefined };


