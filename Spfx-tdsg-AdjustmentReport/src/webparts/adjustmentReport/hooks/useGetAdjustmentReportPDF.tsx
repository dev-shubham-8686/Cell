import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { getAdjustmentReportPDF } from "../api/AdjustmentReportPDF.api";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api"; // Assuming this is the return type

export const useGetAdjustmentReportPDF = (): UseMutationResult<IAjaxResult, Error, number> => {
  return useMutation<IAjaxResult, Error, number>(
    (id: number) => getAdjustmentReportPDF(id)
  );
};
