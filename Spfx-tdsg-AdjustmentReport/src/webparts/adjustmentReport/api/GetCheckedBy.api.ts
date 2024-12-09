import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface ICheckedBy {
  employeeId: number;
  employeeName?: string;
  Email?: string;
}

export interface ICheckedByResponse {
  ResultType?: number;
  StatusCode?: number;
  Message: string;
  ReturnValue: ICheckedBy[];
}

export const getCheckedByOptions = async (): Promise<ICheckedByResponse> => {
  const response = await apiClient.get<ICheckedByResponse>(`${basePath}/GetCheckedBy`);

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
