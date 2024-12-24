import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { ICustomAxiosConfig } from "../interface";
import apiClient from "../utils/axiosInstance";

export interface IDeligate {
    FormId?: number;
    UserId?: number;   // the person who is new deligate 
    DelegateUserId?:number ;  // who is performing action -- id of admin 
    ApproverTaskId?:number ;
    comment?: string;
}

export const deligate = async (
    payload: IDeligate
): Promise<boolean> => {
    const config: ICustomAxiosConfig = {
        SHOW_NOTIFICATION: true,
      };
    const url = `${basePathwithprefix}/AdjustmentReport/PullBack`;
    console.log(JSON.stringify(payload))
    const response = await apiClient.post<boolean>(url, payload,config);
    return response.data;
};
