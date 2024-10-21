import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export interface ISubMachine {
  MachineId: number;
  MachineName: string;
}

export interface ISubMachines {
  ResultType?: Number;
  StatusCode?: Number;
  Message: string;
  ReturnValue: ISubMachine[];
}

export const getAllSubMachines = async (
  machineId: number
): Promise<ISubMachines> => {
  const response = await apiClient.get<ISubMachines>(
    `${basePath}/GetAllSubMachines/${machineId}`
  );

  return {
    Message: response.data.Message,
    ReturnValue: response.data.ReturnValue,
  };
};
