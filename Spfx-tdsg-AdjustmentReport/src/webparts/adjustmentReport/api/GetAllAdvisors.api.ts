import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IAjaxResult {
  ResultType?: number;
  StatusCode?: number;
  Message: string;
  ReturnValue: IAdvisorDetail[];
}

export interface IAdvisorDetail {
  employeeId: number;
  employeeName: string;
}

export const getAllAdvisors = async (): Promise<IAdvisorDetail[]> => {
  const response = await apiClient.get<IAjaxResult>(`${basePath}/GetAllAdvisors`);
  console.log({ response });

  const list: IAdvisorDetail[] = response.data.ReturnValue;
  return list;
};
