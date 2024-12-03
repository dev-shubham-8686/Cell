//import axios from "axios";    
//import { ROOT_SERVICE_URL, SERVICE_URL } from "../GLOBAL_CONSTANT";
import { TECNICAL_API_SERVICE_URL, TECNICAL_ROOT_SERVICE_URL } from "../GLOBAL_CONSTANT";
import http from "./http";

const API_URL = TECNICAL_API_SERVICE_URL;

const ROOT_API_URL = TECNICAL_ROOT_SERVICE_URL;

// Function to fetch technical instruction list with pagination and filters
export const fetchTechnicalInstructions = async (params: any) => {
  try {
    const response = await http.get(`${API_URL}/AllList`, {
      params: { 
        createdBy: params.createdBy, // dynamically use createdBy from params
        skip: (params.pagination.current - 1) * params.pagination.pageSize, // skip calculation
        take: params.pagination.pageSize || 10, // limit or take
        order: params.sorter.order || "Desc", // ASC or DESC
        orderBy: params.sorter.orderBy || "CreatedDate", // field to order by
        searchColumn: params.searchColumn || "", // if a specific column needs to be searched
        searchValue: params.searchText || "" // the search text
      }
    });

    return response.data;  // Return the data from API
  } catch (error) {
    throw new Error("Error fetching data");
  }
};

// Function to fetchTechnicalInstructionsApprovalList with pagination and filters
export const fetchTechnicalInstructionsUpdate = async (params: any) => {
  try {
    const response = await http.get(`${API_URL}/Get`, {
      params: { 
        createdBy: params.createdBy, // dynamically use createdBy from params
        skip: (params.pagination.current - 1) * params.pagination.pageSize, // skip calculation
        take: params.pagination.pageSize || 10, // limit or take
        order: params.sorter.order || "Desc", // ASC or DESC
        orderBy: params.sorter.orderBy || "CreatedDate", // field to order by
        searchColumn: params.searchColumn || "", // if a specific column needs to be searched
        searchValue: params.searchText || "" // the search text
      }
    });

    return response.data;  // Return the data from API
  } catch (error) {
    throw new Error("Error fetching data");
  }
};

// Function to create or update technical instruction 
export const addOrUpdateTechnicalInstruction = (data: any): Promise<any> => {
    return http.post(`${API_URL}/AddOrUpdate`, data, {
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

// Function to get technical instruction by ID
export const getTechnicalInstructionById = (id: string): Promise<any> => {
  return http.get(`${API_URL}/GetById`, {
    params: { Id: id },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to delete a technical instruction by ID
export const deleteTechnicalInstruction = (id: string): Promise<any> => {
  return http.delete(`${API_URL}/Delete`, {
    params: { Id: id },
  })
  .then((response) => {
    return response.data; // Return the response data
  })
  .catch((error) => {
    throw new Error("Error deleting data"); // Handle errors
  });
};

// Function to get equipment easter List
export const getEquipmentMasterList = (): Promise<any> => {
  return http.get(`${API_URL}/GetEquipmentMasterList`)
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to delete a technical attachment by ID
export const deleteTechnicalAttachment = (TechnicalAttachmentId: string): Promise<any> => {
  return http.delete(`${API_URL}/TechnicalAttachment`, {
    params: { TechnicalAttachmentId: TechnicalAttachmentId },
  })
  .then((response) => {
    return response.data; // Return the response data
  })
  .catch((error) => {
    throw new Error("Error deleting data"); // Handle errors
  });
};

// Function to create rechnical attachment
export const createTechnicalAttachment = (data: any): Promise<any> => {
  return http.post(`${API_URL}/CreateTechnicalAttachment`, data, {
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

// Function to fetchTechnicalInstructionsApprovalList with pagination and filters
export const fetchTechnicalInstructionsApprovalList = async (params: any) => {
  try {
    const response = await http.get(`${API_URL}/GetApprovalList`, {
      params: { 
        createdBy: params.createdBy, // 70 // dynamically use createdBy from params
        skip: (params.pagination.current - 1) * params.pagination.pageSize, // skip calculation
        take: params.pagination.pageSize || 10, // limit or take
        order: params.sorter.order || "Desc", // ASC or DESC
        orderBy: params.sorter.orderBy || "CreatedDate", // field to order by
        searchColumn: params.searchColumn || "", // if a specific column needs to be searched
        searchValue: params.searchText || "" // the search text
      }
    });

    return response.data;  // Return the data from API
  } catch (error) {
    throw new Error("Error fetching data");
  }
};

// Function to get equipment easter List
export const GetHistoryData = (technicalId:string): Promise<any> => {
  return http.get(`${API_URL}/GetHistoryData`, {
    params: { technicalId: technicalId },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to updateApproveAskToAmend technical instruction 
export const updateApproveAskToAmend = (data: any): Promise<any> => {
  return http.post(`${API_URL}/UpdateApproveAskToAmend`, null, {params: {...data}})
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error occurred while saving data");
    
  });
};

// Function to pullBack technical instruction 
export const pullBack = (data: any): Promise<any> => {
  return http.post(`${API_URL}/PullBack`, null, {params: {...data}})

  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error occurred while saving data");
    
  });
};

// Function to getCurrentApprover technical instruction by ID
export const getCurrentApprover = (technicalId: string, userId: string): Promise<any> => {
  return http.get(`${API_URL}/GetCurrentApprover`, {
    params: { technicalId, userId },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to getHistoryData technical instruction by ID
export const getHistoryData = (technicalId: string): Promise<any> => {
  return http.get(`${API_URL}/GetHistoryData`, {
    params: { technicalId },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to getApprorverFlowData technical instruction by ID
export const getApprorverFlowData = (technicalId: string): Promise<any> => {
  return http.get(`${API_URL}/GetApprorverFlowData`, {
    params: { technicalId },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to technicalExcel technical instruction by ID
export const technicalExcel = (technicalId: string): Promise<any> => {
  return http.get(`${API_URL}/TechnicalExcel`, {
    params: { technicalId},
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to materialPDF technical instruction by ID
export const technicalPDF = (technicalId: string): Promise<any> => {
  return http.get(`${API_URL}/TechnicalPDF`, {
    params: { technicalId},
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to materialExcelListing technical instruction by ID
export const technicalExcelListing = (fromDate: string, todate: string, employeeId: string, type: string): Promise<any> => {
  return http.get(`${API_URL}/TechnicalExcelListing`, {
    params: { fromDate, todate, employeeId, type },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};


// Function to getAllSections by departmentId
export const getAllSections = (departmentId: string): Promise<any> => {
  return http.get(`${ROOT_API_URL}/GetAllSections`, {
    params: { departmentId},
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

export const getAllSectionsv2 = (): Promise<any> => {
  return http.get(`${API_URL}/GetAllSections`)
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};


// Function to close technical instruction 
export const closeTechnical = (data: any): Promise<any> => {
  return http.post(`${API_URL}/CloseTechnical`, data)

  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error occurred while saving data");
    
  });
};


// Function to Technical ReviseList by ID
export const technicalReviseList = (technicalId: string): Promise<any> => {
  return http.get(`${API_URL}/TechnicalReviseList`, {
    params: { technicalId },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

// Function to Technical Reopen 
export const technicalReopen = (technicalId: string, userId: string): Promise<any> => {
  return http.post(`${API_URL}/TechnicalReopen`, null, {params: {technicalId, userId}})

  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error occurred while saving data");
    
  });
};

// Function to delete a technical outline attachment by ID
export const deleteTechnicalOutlineAttachment = (TechnicalOutlineAttachmentId: string): Promise<any> => {
  return http.delete(`${API_URL}/TechnicalOutlineAttachment`, {
    params: { TechnicalOutlineAttachmentId: TechnicalOutlineAttachmentId },
  })
  .then((response) => {
    return response.data; // Return the response data
  })
  .catch((error) => {
    throw new Error("Error deleting data"); // Handle errors
  });
};

// Function to create rechnical outline attachment
export const createTechnicalOutlineAttachment = (data: any): Promise<any> => {
  return http.post(`${API_URL}/CreateTechnicalOutlineAttachment`, data, {
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

export const getAllEmployee = (): Promise<any> => {
  return http.get(`${API_URL}/GetAllEmployee`)
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};

export const changeRequestOwner = (technicalId: string, userId: string): Promise<any> => {
  return http.post(`${API_URL}/ChangeRequestOwner`, null, {params: {technicalId, userId}})

  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error occurred while saving data");
    
  });
};


export const updateOutlineEditor = (data: any): Promise<any> => {
  return http.post(`${API_URL}/UpdateOutlineEditor`, data, {
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

export const notifyCellDivPart = (technicalId: string): Promise<any> => {
  return http.get(`${API_URL}/NotifyCellDivPart`, {
    params: { technicalId },
  })
  .then((response) => {
    return response.data; // Return the data from the response
  })
  .catch((error) => {
    throw new Error("Error fetching data"); // Handle errors
  });
};