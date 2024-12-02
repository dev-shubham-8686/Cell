import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IArea {
  AreaId: number;
  AreaName: string;
}

export interface IAreas {
  ResultType?: Number;
  StatusCode?: Number;
  Message: string;
  ReturnValue: IArea[];
}

export const getAllAreas = async (): Promise<IAreas> => {
  const response = await apiClient.get<IAreas>(`${basePath}/GetAllAreas`);

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
