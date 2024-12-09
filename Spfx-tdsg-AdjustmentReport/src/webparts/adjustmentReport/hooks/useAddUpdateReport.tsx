import { useMutation } from "@tanstack/react-query";
import {
  addUpdateReport,
  IAddUpdateReportPayload,
} from "../api/AddUpdateReport.api";

export const useAddUpdateReport = () => {
  return useMutation(async (payload: IAddUpdateReportPayload) => {
    const success = await addUpdateReport(payload);
    return success;
  });
};
