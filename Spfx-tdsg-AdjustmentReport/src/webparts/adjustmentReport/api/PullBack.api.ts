import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { ICustomAxiosConfig } from "../interface";
import apiClient from "../utils/axiosInstance";

export interface IPullBack {
    AdjustmentReportId: number;
    userId: number;
    comment: string;
}

export const pullBack = async (
    payload: IPullBack
): Promise<boolean> => {
    const config: ICustomAxiosConfig = {
        SHOW_NOTIFICATION: true,
      };
    const url = `${basePathwithprefix}/AdjustmentReport/PullBack`;
    console.log(JSON.stringify(payload))
    const response = await apiClient.post<boolean>(url, payload,config);
    return response.data;
};
