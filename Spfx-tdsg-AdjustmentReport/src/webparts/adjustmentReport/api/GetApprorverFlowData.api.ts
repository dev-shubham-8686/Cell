import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export const getApprorverFlowData = async (id : number): Promise<any> => {
    const response = await apiClient.get(`${basePathwithprefix}/GetApprorverFlowData/${id}`,
    );
  
    return {
      Message: response.data.Message,
      ReturnValue: response.data.ReturnValue,
    };
  };