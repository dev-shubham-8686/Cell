import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { ICustomAxiosConfig } from "../interface";
import apiClient from "../utils/axiosInstance";

export interface IDelegate {
    FormId?: number;
    UserId?: number;   // the person who is new delegate 
    DelegateUserId?:number ;  // who is performing action -- id of admin 
    activeUserId?:number
    ApproverTaskId?:number ;
    Comments?: string;
}

export const delegate = async (
    payload: IDelegate
): Promise<boolean> => {
    const config: ICustomAxiosConfig = {
        SHOW_NOTIFICATION: true,
      };
    const url = `${basePathwithprefix}/AdjustmentReport/InsertDelegate`;
    console.log(JSON.stringify(payload))
    const response = await apiClient.post<boolean>(url, payload,config);
    return response.data;
};
