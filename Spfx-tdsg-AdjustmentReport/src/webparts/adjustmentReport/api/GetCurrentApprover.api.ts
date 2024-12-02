import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

export interface IGetCurrentApproverPayload {
    AdjustmentReportId: number;
    userId: number;
}

export const getCurrentApprover = async (
    payload: IGetCurrentApproverPayload
): Promise<IAjaxResult> => {
    const url = `${basePathwithprefix}/AdjustmentReport/GetCurrentApprover?Id=${payload.AdjustmentReportId}&userId=${payload.userId}`;

    const response = await apiClient.get(url);
    return response.data;
};
