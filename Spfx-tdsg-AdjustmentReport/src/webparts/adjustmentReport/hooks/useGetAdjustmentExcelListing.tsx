import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IAdjustmentReportListing } from "../api/AdjustmentReportListing.api";
import { getAdjustmentExcelListing } from "../api/AdjustmentExcelListing.api";

export const useGetAdjustmentExcelListing = (
    fromDate: string,
    todate: string,
    employeeId: string,
    type: string
): UseQueryResult<IAdjustmentReportListing> => {
    return useQuery(
        [
            "get-all-adjustment-reports",
            fromDate,
            todate,
            employeeId,
            type,
        ],
        () =>
            getAdjustmentExcelListing(
                fromDate,
                todate,
                employeeId,
                type,
            ),
        {
            keepPreviousData: true,
        }
    );
};
