import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { AdjustmentReportPDFParams } from "../hooks/useGetAdjustmentReportPDF";
import apiClient from "../utils/axiosInstance";
import { downloadPDF } from "../utils/utility";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

export const getAdjustmentReportPDF = async ({
  id,
  AdjustmentReportNo,
}: AdjustmentReportPDFParams): Promise<IAjaxResult> => {
  const response = await apiClient.get(
    `${basePathwithprefix}/AdjustmentReport/AdjustmentReportPDF?adjustmentreportId=${id}`
  );
  const data = response.data.ReturnValue;
  downloadPDF(data, AdjustmentReportNo);
  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
