import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getApprorverFlowData } from "../api/GetApprorverFlowData.api";
import { IWorkflowDetail } from "../interface";

export const useGetApprorverFlowData = (id : number): UseQueryResult<IWorkflowDetail[]> => {
  return useQuery(["get-approver-data"], () => getApprorverFlowData(id), {
    keepPreviousData: true,
  });
};
