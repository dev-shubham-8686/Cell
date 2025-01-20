import { basePath, basePathwithprefix } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";


export const getAllSubMachineMaster = (): Promise<any> => {
    return apiClient.get(`${basePath}/GetAllSubMachines`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
  };

  export const subMachineMasterAddOrUpdate = (data: any): Promise<any> => {
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

  export const deleteSubMachineMaster = (Id: string): Promise<any> => {
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