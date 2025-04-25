import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface ISectionMaster {
  sectionId: number;
  sectionName: string;
}

export interface ISections {
  ResultType?: Number;
  StatusCode?: Number;
  Message: string;
  ReturnValue: ISectionMaster[];
}

export const getAllSections = async (): Promise<ISections> => {
  const response = await apiClient.get<ISections>(`${basePath}/GetAllSection`);

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
