import http from "../../http";

export const getAllUOMMaster = (): Promise<any> => {
  return http
    .get(`/MasterTbl/GetUnitOfMeasureMaster`)
    .then((response) => {
      return response.data; // Return the data from the response
    })
    .catch((error) => {
      throw new Error("Error fetching data"); // Handle errors
    });
};

export const uomMasterAddOrUpdate = (data: any): Promise<any> => {
  return http
    .post(`/MasterTbl/AddUpdateUnitOfMeasureMaster`, data, {
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

export const deleteUOMMaster = (Id: string): Promise<any> => {
  // return ;
  return http
    .delete(`/MasterTbl/DeleteUnitOfMeasure`, {
      params: { Id: Id },
    })
    .then((response) => {
      return response.data; // Return the response data
    })
    .catch((error) => {
      throw new Error("Error deleting data"); // Handle errors
    });
};
