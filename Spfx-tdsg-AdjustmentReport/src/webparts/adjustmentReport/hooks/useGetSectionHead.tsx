import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IAjaxResult } from "../interface";
import { getSectionHead } from "../api/GetSectionHead.api";

export const useGetSectionHead = (id: number): UseQueryResult<IAjaxResult> => {
    return useQuery(["get-section-head"], () => getSectionHead(id), {
        keepPreviousData: true,
    });
};
