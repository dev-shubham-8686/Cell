import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

export interface ICellDepartments {
  DepartmentId: number;
  DepartmentName?: string;
}

export const getCellDepartmentsById = async (
  id: number
): Promise<ICellDepartments[]> => {
  const response = await apiClient.get(
    `${basePathwithprefix}/AdjustmentReport/CellDepartment?departmentId=${id}`
  );

  const list: ICellDepartments[] = response?.data?.ReturnValue;
  return list;
};
