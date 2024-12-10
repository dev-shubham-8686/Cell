import * as dayjs from "dayjs";
import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IAdvisorCommentsData {
    AdjustmentAdvisorId?: number ;
    AdvisorId?: number 
    AdjustmentReportId?: number 
    Comment?: string ; 
  }



export const addUpdateAdvisorComment = async (
  payload: IAdvisorCommentsData
): Promise<boolean> => {
  const url = `${basePathwithprefix}/AdjustmentReport/InsertAdvisor`; // need to change
  console.log(JSON.stringify(payload))
  const response = await apiClient.post<boolean>(url, payload);
  return response.data;
};
