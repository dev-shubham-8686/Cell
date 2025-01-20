import { basePath, basePathwithprefix } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";


export const getAllMachineMaster = (): Promise<any> => {
    return apiClient.get(`${basePath}/GetAllMachines`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
  };

  export const machineMasterAddOrUpdate = (data: any): Promise<any> => {
    console.log("Add or update area payload", data);
    return ;
    // return apiClient.post(`${basePath}/GetEquipmentMasterTblAddOrUpdate`, data, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // .then((response) => {
    //   return response.data; // Return the data from the response
    // })
    // .catch((error) => {
    //     // Something happened in setting up the request that triggered an Error
    //     throw new Error("Error occurred while saving data");
      
    // });
  };

  export const deleteMachineMaster = (Id: string): Promise<any> => {
    return ;
    // return apiClient.delete(`${basePath}/GetEquipmentMasterTblDelete`, {
    //   params: { Id: Id },
    // })
    // .then((response) => {
    //   return response.data; // Return the response data
    // })
    // .catch((error) => {
    //   throw new Error("Error deleting data"); // Handle errors
    // });
  };