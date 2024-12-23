import { useMutation } from "@tanstack/react-query";

import http from "../../../http";
import {
  ICustomAxiosConfig,
} from "../../../interface";
import {  GET_APPROVE_ASK_TO_AMMEND } from "../../../URLS";
import { IApproveAskToAmendPayload } from "../../../components/common/workFlowButtons";

const ApproveAskToAmmend = async (
    payload: IApproveAskToAmendPayload
) => {
  console.log("APPROVEASKTOAMMENDPAYLOAD",payload)
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
    params: {
        ApproverTaskId:payload.ApproverTaskId,
        CurrentUserId:payload.CurrentUserId,
        type:payload.type,
        comment:payload.comment,
        materialConsumptionId:payload.materialConsumptionId
    }
  };
  
  const response = await http.post<string>(
    GET_APPROVE_ASK_TO_AMMEND,
   {},
    config
  );
  console.log("ATOA RESPONSE ",response)

  return response.data;
};

const useApproveAskToAmmend = (userId:number, materialConsumptionId:number) =>
  useMutation<string, null, IApproveAskToAmendPayload>({
    mutationKey: ["approve-ask-to-ammend",{userId,materialConsumptionId}],
    mutationFn: ApproveAskToAmmend,
    cacheTime:0
  });

export default useApproveAskToAmmend;
