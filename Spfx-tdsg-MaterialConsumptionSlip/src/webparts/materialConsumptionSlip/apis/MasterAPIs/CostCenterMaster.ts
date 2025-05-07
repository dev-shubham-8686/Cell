import http from "../../http";

export const getAllCostCenterMaster = (): Promise<any> => {
  return http
    .get(`/MasterTbl/GetAllCostCenterSelection`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
};

export const costCenterMasterAddOrUpdate = (data: any): Promise<any> => {
  return http
    .post(`/MasterTbl/AddUpdateCostCenterMaster`, data, {
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

export const deleteCostCenterMaster = (Id: string): Promise<any> => {
  return;
  // return http.delete(`/MasterTbl/DeleteCostCenter`, {
  //   params: { Id: Id },
  // })
  // .then((response) => {
  //   return response.data; // Return the response data
  // })
  // .catch((error) => {
  //   throw new Error("Error deleting data"); // Handle errors
  // });
};
