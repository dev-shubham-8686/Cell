import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

export const getAdvisorCommentsById = async (id : number): Promise<IAjaxResult> => {
  
    const response = await apiClient.get(`${basePathwithprefix}/AdjustmentReport/GetAdvisorData?adjustmentReportId=${id}`,
    );
    
    return {
      ResultType: response.data.ResultType,
      StatusCode: response.data.StatusCode,
      Message: response.data.Message,
      ReturnValue: response.data.ReturnValue,
    };
  };