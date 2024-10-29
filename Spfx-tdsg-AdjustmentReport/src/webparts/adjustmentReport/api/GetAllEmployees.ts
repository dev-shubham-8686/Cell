import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IEmployee {
  employeeId: number;
  employeeName?: string;
  Email?: string;
}

export interface IEmployeeResponse {
  ResultType?: number;
  StatusCode?: number;
  Message: string;
  ReturnValue: IEmployee[];
}

export const getAllEmployees = async (): Promise<IEmployeeResponse> => {
  const response = await apiClient.get<IEmployeeResponse>(`${basePath}/GetAllEmployee`);
  console.log({ response });

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
