import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { getCurrentApprover, IGetCurrentApproverPayload } from "../api/GetCurrentApprover.api";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api";

export const useGetCurrentApprover = (): UseMutationResult<IAjaxResult, unknown, IGetCurrentApproverPayload> => {
  return useMutation(async (payload: IGetCurrentApproverPayload) => await getCurrentApprover(payload));
};
