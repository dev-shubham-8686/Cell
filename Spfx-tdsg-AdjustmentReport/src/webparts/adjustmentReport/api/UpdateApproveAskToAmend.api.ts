import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IApproveAskToAmendPayload {
    ApproverTaskId: number;
    CurrentUserId: number;
    Type: 1 | 2 | 3; // 1 for Approve, 2 for Reject and 3 for Ask to Amend
    Comment: string;
    AdjustmentId: number;
    AdvisorId?: number;
    AdditionalDepartmentHeads?: IAdditionalDepartmentHeads[];
    IsDivHeadRequired?:boolean;
}

export interface IAdditionalDepartmentHeads {
    EmployeeId: number;
    DepartmentId: number;
    ApprovalSequence: number;
}

export const updateApproveAskToAmend = async (
    payload: IApproveAskToAmendPayload
): Promise<boolean> => {
    const url = `${basePathwithprefix}/AdjustmentReport/UpdateApproveAskToAmend`; // need to change
    console.log(JSON.stringify(payload))
    const response = await apiClient.post<boolean>(url, payload);
    return response.data;
};
