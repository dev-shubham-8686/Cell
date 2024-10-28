import { useMutation } from "@tanstack/react-query";

import { ICustomAxiosConfig } from "../../interface";
import { GET_APPROVE_ASK_TO_AMMEND } from "../../URLs";
import http from "../../http";
import { IEmailAttachments } from "../../components/common/TextBoxModal";

export interface IApproveAskToAmendPayload {
  ApproverTaskId: number;
  CurrentUserId: number;
  Type: 1 |2| 3; // 1 for Approve, 2 for Reject and 3 for Ask to Amend
  Comment: string;
  EquipmentId: number;
  EquipmentApprovalData?: ITargetData;
}

export interface ITargetData {
  EquipmentId?:number;
  IsToshibaDiscussion?: boolean;
  TargetDate?: string;
  IsPcrnRequired?:boolean;
  Comment?: string;
  AdvisorId?: number;
  EmailAttachments?:IEmailAttachments[];
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
  
  return response.data;
};

const useApproveAskToAmmend = (userId: number, equipmentId: number) =>
  useMutation<string, null, IApproveAskToAmendPayload>({
    mutationKey: ["approve-ask-to-ammend", { userId, equipmentId }],
    mutationFn: ApproveAskToAmmend,
    cacheTime: 0,
  });

export default useApproveAskToAmmend;
