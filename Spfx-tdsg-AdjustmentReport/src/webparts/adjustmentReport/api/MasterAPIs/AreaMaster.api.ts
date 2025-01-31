import { basePath, basePathwithprefix } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";


export const getAllAreaMaster = (): Promise<any> => {
    return apiClient.get(`/MasterTbl/GetAreaMaster`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
  };

  export const areaMasterAddOrUpdate = (data: any): Promise<any> => {
    console.log("Add or update area payload", data);
    return apiClient.post(`/MasterTbl/AddUpdateArea`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error occurred while saving data");
      
    });
  };

  export const deleteAreaMaster = (Id: string): Promise<any> => {
    return apiClient.delete(`/MasterTbl/DeleteArea`, {
      params: { areaId: Id },
    })
    .then((response) => {
      return response.data; // Return the response data
    })
    .catch((error) => {
      throw new Error("Error deleting data"); // Handle errors
    });
  };