import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAdjustmentReportInfo } from "./IAdjustmentReport";

export interface IAdjustmentReportListing {
    StatusCode: number;
    Message: string;
    ReturnValue: IAdjustmentReportInfo[];
}

export const getApprovalList = async (
    pageIndex: number,
    pageSize: number,
    searchValue: string,
    sortColumn?: string,
    orderBy?: string,
    createdBy?: number,
): Promise<IAdjustmentReportListing> => {
    const response = await apiClient.get<IAdjustmentReportListing>(
        `${basePathwithprefix}/AdjustmentReport/GetApprovalList`,
        {
            params: {
                pageIndex,
                pageSize,
                searchValue,
                ...(sortColumn && { sortColumn }),
                ...(orderBy && { orderBy }),
                createdBy
            },

        }
    );

    return {
        StatusCode: response.data.StatusCode,
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};
