import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAdditionalDepartmentHeads } from "../api/GetAdditionalDepartmentHeads.api";

export interface IEmployee {
    EmployeeId: number;
    EmployeeName?: string;
    DepartmentId?:number;
    Email?: string;
}

export const useGetAdditionalDepartmentHeads = (): UseQueryResult<IEmployee[]> => {
    return useQuery(["get-additional-department-head"], () => getAdditionalDepartmentHeads(), {
        keepPreviousData: true,
    });
};
