import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import { IAdjustmentReportInfo } from "../interface";
import apiClient from "../utils/axiosInstance";
import { IAjaxResult } from "./DeleteAdjustmentReport.api";

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
): Promise<IAjaxResult> => {
    const response = await apiClient.get<IAjaxResult>(
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
