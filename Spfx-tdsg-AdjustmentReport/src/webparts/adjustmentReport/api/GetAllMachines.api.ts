import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface IMachine {
  MachineId: number;
  MachineName: string;
}

export interface IMachines {
  ResultType?: Number;
  StatusCode?: Number;
  Message: string;
  ReturnValue: IMachine[];
}

export const getAllMachines = async (): Promise<IMachines> => {
  const response = await apiClient.get<IMachines>(`${basePath}/GetAllMachines`);

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
