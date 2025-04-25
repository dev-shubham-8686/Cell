import { basePath, basePathwithprefix } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";

export const getAllSubMachineMaster = (): Promise<any> => {
  return apiClient
    .get(`/MasterTbl/GetSubMachineMaster`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
};

export const subMachineMasterAddOrUpdate = (data: any): Promise<any> => {
  return apiClient
    .post(`/MasterTbl/AddUpdateSubMachine`, data, {
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

export const deleteSubMachineMaster = (Id: string): Promise<any> => {
  return apiClient
    .delete(`/MasterTbl/DeleteSubMachine`, {
      params: { Id: Id },
    })
    .then((response) => {
      return response.data; // Return the response data
    })
    .catch((error) => {
      throw new Error("Error deleting data"); // Handle errors
    });
};
