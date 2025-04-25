import * as dayjs from "dayjs";
import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { ICustomAxiosConfig } from "../interface";

export interface IAdvisorCommentsData {
  AdjustmentAdvisorId?: number;
  AdvisorId?: number;
  AdjustmentReportId?: number;
  Comment?: string;
  ModifiedBy?: number;
}

export const addUpdateAdvisorComment = async (
  payload: IAdvisorCommentsData
): Promise<boolean> => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
  const url = `${basePathwithprefix}/AdjustmentReport/InsertAdvisor`; // need to change
  const response = await apiClient.post<boolean>(url, payload, config);
  return response.data;
};
