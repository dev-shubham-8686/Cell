import * as dayjs from "dayjs";
import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

interface Image {
  DocumentName: string;
  DocumentFilePath: string;
  IsOldPhoto: boolean;
  SequenceId: number;
}

interface Photos {
  BeforeImages: Image[];
  AfterImages: Image[];
}

export interface ChangeRiskManagement {
  Changes?: string;
  RiskWithChanges?: string;
  Factors?: string;
  CounterMeasures: string;
  Function?: string;
  DueDate?: dayjs.Dayjs;
  PersonInChargeId?: number;
  Results?: string;
}

export interface IAddUpdateReportPayload {
  ReportNo?: string;
  RequestBy?: string;
  CheckedBy?: number;
  When?: dayjs.Dayjs;
  Area?: number;
  MachineName?: number;
  SubMachineName?: number[];
  DescribeProblem?: string;
  Observation?: string;
  RootCause?: string;
  AdjustmentDescription?: string;
  ConditionAfterAdjustment?: string;
  Photos?: Photos;
  ChangeRiskManagementRequired?: boolean;
  ChangeRiskManagementList: ChangeRiskManagement[];
  IsSubmit?: boolean;
  CreatedBy?: number;
  CreatedDate?: dayjs.Dayjs;
  ModifiedBy?: number;
  ModifiedDate?: dayjs.Dayjs;
}

export const addUpdateReport = async (
  payload: IAddUpdateReportPayload
): Promise<boolean> => {
  const url = `${basePath}/AdjustmentReport/POST`; // need to change

  const response = await apiClient.post<boolean>(url, payload);
  return response.data;
};
