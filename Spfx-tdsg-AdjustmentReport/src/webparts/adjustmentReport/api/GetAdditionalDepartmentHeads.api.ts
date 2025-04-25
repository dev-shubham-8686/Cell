import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { IAjaxResult } from "../interface";
import apiClient from "../utils/axiosInstance";

export interface IEmployee {
  EmployeeId: number;
  EmployeeName?: string;
  Email?: string;
}

export const getAdditionalDepartmentHeads = async (
  id: number
): Promise<IEmployee[]> => {
  const response = await apiClient.get<IAjaxResult>(
    `${basePathwithprefix}/AdjustmentReport/GetAdditionalDepartmentHeads?departmentId=${id}`
  );
  const list: IEmployee[] = response.data.ReturnValue;
  return list;
};
