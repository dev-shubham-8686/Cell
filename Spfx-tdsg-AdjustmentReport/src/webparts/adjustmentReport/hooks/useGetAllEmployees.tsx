import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllEmployees, IEmployeeResponse } from "../api/GetAllEmployees";

export const useGetAllEmployees = (): UseQueryResult<IEmployeeResponse> => {
  return useQuery(["get-all-employees"], () => getAllEmployees(), {
    keepPreviousData: true,
  });
};
