import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllSections, ISections } from "../api/GetAllSections.api";

export const useGetAllSections = (): UseQueryResult<ISections> => {
  return useQuery(["get-all-sections"], () => getAllSections(), {
    keepPreviousData: true,
  });
};
