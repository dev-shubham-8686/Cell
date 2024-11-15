import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

export const getAdjustmentReportPDF = async (id : number): Promise<IAjaxResult> => {
    const response = await apiClient.get(`${basePathwithprefix}/AdjustmentReport/AdjustmentReportPDF?adjustmentreportId=${id}`,
    );
  
    return {
      Message: response.data.Message,
      ReturnValue: response.data.ReturnValue,
    };
  };