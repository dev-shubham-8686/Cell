import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAdjustmentReportById } from "../api/GetAdjustmentReportById.api";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api";

export const useGetAdjustmentReportById = (id: number): UseQueryResult<IAjaxResult> => {
  return useQuery(['get-adjustmentReport-byid', id], () => getAdjustmentReportById(id), {
    enabled: !!id, // Optionally disable the query if id is falsy
  });
};
