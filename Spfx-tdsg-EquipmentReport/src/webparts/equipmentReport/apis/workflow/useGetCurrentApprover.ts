import { useQuery } from "@tanstack/react-query";
import { GET_CURRENT_APPROVER_DATA } from "../../URLs";
import http from "../../http";


export interface IApproverTask {
    approverTaskId: number;
    status: string; //this will mostly be InReview
    userId: number;
    seqNumber?:number;
  }

const getCurrentApproverData = async (equipmentId?: number,userId?: number) => {
  if (!userId || !equipmentId) return undefined;
  
  const response = await http.get<{
    ReturnValue: IApproverTask;
  }>(GET_CURRENT_APPROVER_DATA, { params: {equipmentId,userId } });
  console.log("CURRENT APPROVER DATA RESPONSE",response)
  
  return response.data.ReturnValue;
};

const useGetCurrentApproverData = (equipmentId?: number,userId?: number) =>
  useQuery<IApproverTask | undefined>({
    queryKey: ["get-current-approver-data", {equipmentId,userId}],
    queryFn: () => getCurrentApproverData(equipmentId,userId),
    cacheTime: 0,
  });

export default useGetCurrentApproverData;
