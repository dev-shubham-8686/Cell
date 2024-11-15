import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { getAdjustmentExcelListing } from "../api/AdjustmentExcelListing.api";
import { IAjaxResult } from "../api/DeleteAdjustmentReport.api";

export const useExportAdjustmentExcelListing = (): UseMutationResult<IAjaxResult, unknown, {
    fromDate: string;
    toDate: string;
    employeeId: string;
    type: string;
}> => {
    return useMutation(({ fromDate, toDate, employeeId, type }) =>
        getAdjustmentExcelListing(fromDate, toDate, employeeId, type)
    );
};
