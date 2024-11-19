import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IAjaxResult } from "../interface";
import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";

export const getDepartmentHead = async (id : number): Promise<IAjaxResult> => {
    const response = await apiClient.get<IAjaxResult>(`${basePathwithprefix}/AdjustmentReport/GetDepartmentHead?adjustmentreportId=${id}`);

    return {
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};


export const useGetDepartmentHead = (id: number): UseQueryResult<IAjaxResult> => {
    return useQuery(["get-department-head"], () => getDepartmentHead(id), {
        keepPreviousData: true,
    });
};
