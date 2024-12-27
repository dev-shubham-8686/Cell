import http from "../../http";
import { GET_MATERIAL_Master } from "../../URLS";



export const getAllMaterialMaster = (): Promise<any> => {
    return http.get(GET_MATERIAL_Master)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
  };
  
  

  export const addUpdateMaterialMaster = (data: any): Promise<any> => {
    return http.post(`/AddUpdateMaterial`, data, {
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

  export const deleteMaterial = (MaterialId: string): Promise<any> => {
    return http.delete(`/Material`, {
      params: { MaterialId: MaterialId },
    })
    .then((response) => {
      return response.data; // Return the response data
    })
    .catch((error) => {
      throw new Error("Error deleting data"); // Handle errors
    });
  };
  