import { basePath } from "../GLOBAL_CONSTANT";
import { IEmployee } from "../interface";
import apiClient from "../utils/axiosInstance";

export interface IEmployeeResponse {
  ResultType?: number;
  StatusCode?: number;
  Message: string;
  ReturnValue: IEmployee[];
}

export const getAllEmployees = async (): Promise<IEmployeeResponse> => {
  const response = await apiClient.get<IEmployeeResponse>(
    `${basePath}/GetAllEmployee`
  );

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
