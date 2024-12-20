import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { AdjustmentReportPDFParams } from "../hooks/useGetAdjustmentReportPDF";
import { ICustomAxiosConfig } from "../interface";
import apiClient from "../utils/axiosInstance";
import { showSuccess } from "../utils/displayjsx";
import { downloadPDF } from "../utils/utility";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

export const getAdjustmentReportPDF = async ({
  id,
  AdjustmentReportNo,
}: AdjustmentReportPDFParams): Promise<IAjaxResult> => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
  const response = await apiClient.get(
    `${basePathwithprefix}/AdjustmentReport/AdjustmentReportPDF?adjustmentreportId=${id}`,config
  );
  const data = response.data.ReturnValue;
  downloadPDF(data, AdjustmentReportNo);
 
  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
