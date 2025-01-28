import { basePath } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";


export const getAllSectionMaster = (): Promise<any> => {
    return apiClient.get(`${basePath}/GetAllSection`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
  };

  export const sectionMasterAddOrUpdate = (data: any): Promise<any> => {
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

  export const deleteSectionMaster = (Id: string): Promise<any> => {
    console.log("delete Id",Id)
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