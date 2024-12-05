import * as dayjs from "dayjs";
import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAdjustmentReportPhoto, IChangeRiskData } from "../interface";

// interface Image {
//   DocumentName: string;
//   DocumentFilePath: string;
//   IsOldPhoto: boolean;
//   SequenceId: number;
// }

interface Photos {
  BeforeImages: IAdjustmentReportPhoto[];
  AfterImages: IAdjustmentReportPhoto[];
}

export interface ChangeRiskManagement {
  ChangeRiskManagementId?:number
  Changes?: string;
  RiskAssociated?: string;
  Factor?: string;
  CounterMeasures: string;
  FunctionId?: string;
  DueDate?: string;
  PersonInCharge?: number;
  Results?: string;
}

export interface IAddUpdateReportPayload {
  AdjustmentReportId?: number,
  EmployeeId?: number,
  AdvisorId?:number,
  SectionId?: number,
  ReportNo?: string;
  RequestBy?: string;
  CheckedBy?: number;
  When?: dayjs.Dayjs;
  Area?: number[];
  MachineName?: number;
  OtherMachineName?:string;
  OtherSubMachineName?:string;
  SubMachineName?: number[];
  DescribeProblem?: string;
  Observation?: string;
  RootCause?: string;
  AdjustmentDescription?: string;
  ConditionAfterAdjustment?: string;
  Photos?: Photos;
  ChangeRiskManagementRequired?: boolean;
  ChangeRiskManagement_AdjustmentReport: IChangeRiskData[];
  IsSubmit?: boolean;
  CreatedBy?: number;
  CreatedDate?: dayjs.Dayjs;
  ModifiedBy?: number;
  ModifiedDate?: dayjs.Dayjs;
  Status?: string;
  IsAmendReSubmitTask?: boolean,
  DeputyDivHead?:number,
  DepartmentHeadId?:number
}

export interface IAdjustmentReport {
  AdjustmentReportId?: number;
  ReportNo?: string;
  When?: dayjs.Dayjs;
  Area?: number[];
  SectionId?: number;
  MachineName?: number;
  OtherMachineName?: string;
  SubMachineName?: number[];
  OtherSubMachineName?: string;
  RequestBy?: string;
  EmployeeId?: number;
  CheckedBy?: number;
  DescribeProblem?: string;
  Observation?: string;
  RootCause?: string;
  AdjustmentDescription?: string;
  Photos?: Photos;
  ChangeRiskManagementRequired?: boolean;
  ConditionAfterAdjustment?: string;
  ChangeRiskManagement_AdjustmentReport?: ChangeRiskManagement[];
  WorkFlowStatus?: string;
  Status?: string;
  IsSubmit?: boolean;
  IsAmendReSubmitTask?: boolean;
  CreatedDate?: dayjs.Dayjs;
  CreatedBy?: number;
  ModifiedDate?: dayjs.Dayjs;
  ModifiedBy?: number;
  IsDeleted?: boolean;
}

export const addUpdateReport = async (
  payload: IAddUpdateReportPayload
): Promise<boolean> => {
  const url = `${basePathwithprefix}/AdjustmentReport/AddOrUpdate`; // need to change
  console.log(JSON.stringify(payload))
  const response = await apiClient.post<boolean>(url, payload);
  return response.data;
};
