import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IAjaxResult {
    ResultType?: Number;
    StatusCode?: Number;
    Message: string;
    ReturnValue: object;
}

export const deleteAttachment = async (
    id: number
): Promise<IAjaxResult> => {
    const response = await apiClient.delete<IAjaxResult>(`${basePath}/api/AdjustmentReport/DeleteAttachment/${id}`);

    return {
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};
