// AdjustmentReport.api.ts

import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { ICustomAxiosConfig } from "../interface";
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
    const config: ICustomAxiosConfig = {
        SHOW_NOTIFICATION: true,
      };
    const response = await apiClient.delete<IAjaxResult>(`${basePathwithprefix}/AdjustmentReport/Delete/${id}`,config);
    
    return {
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};
