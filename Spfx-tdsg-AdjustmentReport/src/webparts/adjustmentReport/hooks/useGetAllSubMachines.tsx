import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllSubMachines, ISubMachines } from "../api/GetAllSubMachines.api";

export const useGetAllSubMachines = (
  machineId: number
): UseQueryResult<ISubMachines> => {
  return useQuery(
    ["get-all-sub-machines"],
    () => getAllSubMachines(),
    {
      keepPreviousData: true,
    }
  );
};
