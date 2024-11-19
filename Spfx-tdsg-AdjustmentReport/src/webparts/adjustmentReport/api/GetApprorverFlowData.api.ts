import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { IWorkflowDetail } from "../interface";
import apiClient from "../utils/axiosInstance";

export const getApprorverFlowData = async (id : number): Promise<IWorkflowDetail[]> => {
    const response = await apiClient.get(`${basePathwithprefix}/AdjustmentReport/GetApprorverFlowData?Id=${id}`,
    );
  
    return response.data.ReturnValue;
  };