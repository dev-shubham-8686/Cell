// AdjustmentReport.api.ts

import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IAjaxResult {
    ResultType?: number;
    StatusCode?: number;
    Message: string;
    ReturnValue: any;
}

export const deleteAdjustmentReport = async (
    id: number
): Promise<IAjaxResult> => {
    const response = await apiClient.delete<IAjaxResult>(`${basePathwithprefix}/AdjustmentReport/Delete/${id}`);
    
    return {
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};
