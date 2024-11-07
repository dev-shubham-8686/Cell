import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAdjustmentReportInfo } from "./IAdjustmentReport";

export interface IAdjustmentReportListing {
    StatusCode: number;
    Message: string;
    ReturnValue: IAdjustmentReportInfo[];
}

export const getAdjustmentExcelListing = async (
    fromDate: string,
    todate: string,
    employeeId: string,
    type: string
): Promise<IAdjustmentReportListing> => {
    const response = await apiClient.get<IAdjustmentReportListing>(
        `${basePathwithprefix}/AdjustmentReport/AdjustmentExcelListing`,
        {
            params: {
                fromDate,
                todate,
                employeeId,
                type
            },
        }
    );

    return {
        StatusCode: response.data.StatusCode,
        Message: response.data.Message,
        ReturnValue: response.data.ReturnValue,
    };
};
