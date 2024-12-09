import { useMutation } from "@tanstack/react-query";
import { IApproveAskToAmendPayload, updateApproveAskToAmend } from "../api/UpdateApproveAskToAmend.api";

export const useUpdateApproveAskToAmend = () => {
  return useMutation(async (payload: IApproveAskToAmendPayload) => {
    const success = await updateApproveAskToAmend(payload);
    return success;
  });
};
