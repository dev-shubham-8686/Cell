import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAdjustmentReportById } from "../api/GetAdjustmentReportById.api";

export const useGetAdjustmentReportById = (id : number): UseQueryResult<any> => {
  return useQuery(["get-adjustment-report"], () => getAdjustmentReportById(id), {
    keepPreviousData: true,
  });
};
