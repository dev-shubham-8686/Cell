import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { deleteAdjustmentReport, IAjaxResult } from "../api/DeleteAdjustmentReport.api";

export const useDeleteAdjustmentReport = (): UseMutationResult<IAjaxResult, Error, number> => {
  debugger
  return useMutation((id: number) => deleteAdjustmentReport(id));
};
