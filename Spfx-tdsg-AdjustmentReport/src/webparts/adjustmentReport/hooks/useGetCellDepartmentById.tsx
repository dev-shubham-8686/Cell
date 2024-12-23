import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api";
import { getCellDepartmentsById, ICellDepartments } from "../api/GetCellDepartmentsById.api";

export const useGetCellDepartmentsById = (id: number): UseQueryResult<ICellDepartments[]> => {
  return useQuery(['get-cell-department-byid', id], () => getCellDepartmentsById(id), {
    enabled: !!id, // Optionally disable the query if id is falsy
  });
};
