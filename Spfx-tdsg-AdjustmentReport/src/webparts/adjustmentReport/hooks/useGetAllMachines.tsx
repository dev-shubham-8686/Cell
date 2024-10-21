import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllMachines, IMachines } from "../api/GetAllMachines.api";

export const useGetAllMachines = (): UseQueryResult<IMachines> => {
  return useQuery(["get-all-machines"], () => getAllMachines(), {
    keepPreviousData: true,
  });
};
