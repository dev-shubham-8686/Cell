import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllAreas, IAreas } from "../api/GetAllAreas.api";

export const useGetAllAreas = (): UseQueryResult<IAreas> => {
  return useQuery(["get-all-areas"], () => getAllAreas(), {
    keepPreviousData: true,
  });
};
