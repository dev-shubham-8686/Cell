import http from "../../http";


export const getAllCategoryMaster = (): Promise<any> => {
    return http.get(`/GetAllCategory`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
  };

  export const categoryMasterAddOrUpdate = (data: any): Promise<any> => {
    console.log("Add or update area payload", data);
    return ;
    // return apiClient.post(`${basePath}/GetCategoryAddOrUpdate`, data, {
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

  export const deleteCategoryMaster = (Id: string): Promise<any> => {
    return ;
    // return apiClient.delete(`${basePath}/GetCategoryMasterTblDelete`, {
    //   params: { Id: Id },
    // })
    // .then((response) => {
    //   return response.data; // Return the response data
    // })
    // .catch((error) => {
    //   throw new Error("Error deleting data"); // Handle errors
    // });
  };