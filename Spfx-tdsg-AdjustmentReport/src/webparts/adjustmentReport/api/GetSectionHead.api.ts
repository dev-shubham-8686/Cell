import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { IAjaxResult } from "../interface";
import apiClient from "../utils/axiosInstance";

export const getSectionHead = async (id : number): Promise<IAjaxResult> => {
    const response = await apiClient.get<IAjaxResult>(`${basePathwithprefix}/AdjustmentReport/GetSectionHead?adjustmentreportId=${id}`);

    return {
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};
