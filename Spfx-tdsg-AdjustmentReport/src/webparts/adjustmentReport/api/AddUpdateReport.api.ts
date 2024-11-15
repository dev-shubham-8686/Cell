import * as dayjs from "dayjs";
import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAdjustmentReportPhoto } from "../interface";

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
  Changes?: string;
  RisksWithChanges?: string;
  Factors?: string;
  CounterMeasures: string;
  FunctionId?: string;
  DueDate?: string;
  PersonInCharge?: number;
  Results?: string;
}

export interface IAddUpdateReportPayload {
  AdjustmentReportId?: number,
  EmployeeId?: number,
  ReportNo?: string;
  RequestBy?: string;
  CheckedBy?: number;
  When?: dayjs.Dayjs;
  Area?: number[];
  MachineName?: number;
  SubMachineName?: number[];
  DescribeProblem?: string;
  Observation?: string;
  RootCause?: string;
  AdjustmentDescription?: string;
  ConditionAfterAdjustment?: string;
  Photos?: Photos;
  ChangeRiskManagementRequired?: boolean;
  ChangeRiskManagement_AdjustmentReport: ChangeRiskManagement[];
  IsSubmit?: boolean;
  CreatedBy?: number;
  CreatedDate?: dayjs.Dayjs;
  ModifiedBy?: number;
  ModifiedDate?: dayjs.Dayjs;
  Status?: string;
  IsAmendReSubmitTask?: boolean,
}

export const addUpdateReport = async (
  payload: IAddUpdateReportPayload
): Promise<boolean> => {
  const url = `${basePathwithprefix}/AdjustmentReport/AddOrUpdate`; // need to change
  console.log(JSON.stringify(payload))
  const response = await apiClient.post<boolean>(url, payload);
  return response.data;
};
