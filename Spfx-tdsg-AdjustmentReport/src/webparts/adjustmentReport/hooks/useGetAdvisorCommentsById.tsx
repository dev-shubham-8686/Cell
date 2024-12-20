import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api";
import { getAdvisorCommentsById } from "../api/GetAdvisorCommentsById.api";

export const useGetAdvisorCommentsById = (id: number): UseQueryResult<IAjaxResult> => {
  return useQuery(['get-advisor-comments-byid', id], () => getAdvisorCommentsById(id), {
    enabled: !!id,
  });
};
