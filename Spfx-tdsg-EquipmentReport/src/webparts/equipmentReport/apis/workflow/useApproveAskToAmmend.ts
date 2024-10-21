import { useMutation } from "@tanstack/react-query";

import { ICustomAxiosConfig } from "../../interface";
import { GET_APPROVE_ASK_TO_AMMEND } from "../../URLs";
import http from "../../http";

export interface IApproveAskToAmendPayload {
  ApproverTaskId: number;
  CurrentUserId: number;
  Type: 1 | 3; // 1 for Approve and 3 for Ask to Amend
  Comment: string;
  EquipmentId: number;
  EquipmentApprovalData?: IEquipmentApprovalData;
}

export interface IEquipmentApprovalData {
  IsToshibaDiscussion?: boolean;
  TargetDate?: string;
  Comment?: string;
  AdvisorId?: number;
}

const ApproveAskToAmmend = async (payload: IApproveAskToAmendPayload) => {
  console.log("approve payload ", payload);
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };

  const response = await http.post<string>(
    GET_APPROVE_ASK_TO_AMMEND,
    payload,
    config
  );
  console.log("Approve A to A  RESPONSE ", response);

  return response.data;
};

const useApproveAskToAmmend = (userId: number, equipmentId: number) =>
  useMutation<string, null, IApproveAskToAmendPayload>({
    mutationKey: ["approve-ask-to-ammend", { userId, equipmentId }],
    mutationFn: ApproveAskToAmmend,
    cacheTime: 0,
  });

export default useApproveAskToAmmend;
