import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getApprorverFlowData } from "../api/GetApprorverFlowData.api";

export const useGetApprorverFlowData = (id : number): UseQueryResult<any> => {
  return useQuery(["get-approver-data"], () => getApprorverFlowData(id), {
    keepPreviousData: true,
  });
};
