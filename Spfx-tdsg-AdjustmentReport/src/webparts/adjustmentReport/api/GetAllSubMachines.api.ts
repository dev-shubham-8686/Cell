import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface ISubMachine {
  MachineId: number;
  SubMachineName: string;
  SubMachineId: string;
}

export interface ISubMachines {
  ResultType?: Number;
  StatusCode?: Number;
  Message: string;
  ReturnValue: ISubMachine[];
}

export const getAllSubMachines = async (
): Promise<ISubMachines> => {
  const response = await apiClient.get<ISubMachines>(
    `${basePath}/GetAllSubMachines`
  );

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
