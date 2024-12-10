import { message } from "antd";
import { basePath } from "../GLOBAL_CONSTANT";
import axios from "axios";
import { showSuccess } from "./displayjsx";
import { ICustomAxiosConfig } from "../interface";

const apiClient = axios.create({
  baseURL: basePath,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response: any) => {
    
    
    const config: ICustomAxiosConfig = response.config;
    if (config.SHOW_NOTIFICATION && response?.data?.Message) {
      void showSuccess(response?.data?.Message);
    }
        console.log("RESSSSS",response)
    return response;
  }, // If the response is successful, just return it
  (error: any) => {
    console.log("RESSSSS")
    let errorMessage = "An error occurred";

    if (error.response) {
      
      // Server responded with a status code other than 2xx
      const statusCode = error.response.status;
      if (error.response.data && typeof error.response.data === "object") {
        
        // Attempt to extract the message from different properties
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          `Error ${statusCode}`;
      } else {
        
        errorMessage = `Error ${statusCode}: ${error.response.statusText}`;
      }

      // Display the error message
      void message.error(errorMessage);
    } else if (error.request) {
      
      // Request was made but no response was received
      void message.error(
        "No response from the server. Please try again later."
      );
    } else {
      
      // Something else happened while setting up the request
      void message.error("An unexpected error occurred. Please try again.");
    }

    // Optionally log the error details for debugging
    console.error("AxiosError:", error);
    
    // Reject the promise so the calling code can handle the error if needed
    return Promise.reject(error);
  }
);

export default apiClient;
