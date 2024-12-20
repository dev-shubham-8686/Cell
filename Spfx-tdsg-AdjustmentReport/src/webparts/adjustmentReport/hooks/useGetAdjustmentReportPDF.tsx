import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { getAdjustmentReportPDF } from "../api/AdjustmentReportPDF.api";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api"; // Assuming this is the return type

export interface AdjustmentReportPDFParams {
  id: number;
  AdjustmentReportNo: any; // Replace `any` with a more specific type if possible
}
export const useGetAdjustmentReportPDF = (): UseMutationResult<IAjaxResult, Error, AdjustmentReportPDFParams> => {
  return useMutation<IAjaxResult, Error, AdjustmentReportPDFParams>(
    ({ id, AdjustmentReportNo }:{id : number; AdjustmentReportNo:any}) => getAdjustmentReportPDF({id ,AdjustmentReportNo})
  );
};
