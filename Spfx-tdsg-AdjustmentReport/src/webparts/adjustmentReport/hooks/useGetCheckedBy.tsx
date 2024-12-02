import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getCheckedByOptions, ICheckedByResponse } from "../api/GetCheckedBy.api";

export const useGetCheckedBy = (): UseQueryResult<ICheckedByResponse> => {
  return useQuery(["get-checked-by-options"], () => getCheckedByOptions(), {
    keepPreviousData: true,
  });
};
