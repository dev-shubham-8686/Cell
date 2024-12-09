import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllAdvisors, IAdvisorDetail } from "../api/GetAllAdvisors.api";

export const useGetAllAdvisors = (): UseQueryResult<IAdvisorDetail[]> => {
  return useQuery(["get-all-advisore"], () => getAllAdvisors(), {
    keepPreviousData: true,
  });
};
