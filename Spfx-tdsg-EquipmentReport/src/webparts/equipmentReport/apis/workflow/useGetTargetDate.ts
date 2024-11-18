import { useMutation } from "@tanstack/react-query";
import { ITargetData } from "./useApproveAskToAmmend";
import { GET_TARGET_DATE } from "../../URLs";
import http from "../../http";

// Fetch target date based on equipmentId and toshibaDiscussion
const getTargetDate = async (equipmentId?: number, toshibaDiscussion?: boolean) => {
  if (!equipmentId) return undefined;
  
  const response = await http.get<{
    ReturnValue: ITargetData;
  }>(GET_TARGET_DATE, { params: { equipmentId, toshibaDiscussion } });

  console.log("Get Target Date Res", response);
  return response.data.ReturnValue;
};

// Create mutation hook
const useGetTargetDate = (onSuccess?: (data: ITargetData) => void, onError?: (error: any) => void) =>
  useMutation({
    mutationFn: ({ equipmentId, toshibaDiscussion }: { equipmentId: number; toshibaDiscussion?: boolean }) => 
      getTargetDate(equipmentId, toshibaDiscussion),
    onSuccess,
    onError,
  });

export default useGetTargetDate;
