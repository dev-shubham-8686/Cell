import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IAdjustmentReportListing } from "../api/AdjustmentReportListing.api";
import { getApprovalList } from "../api/GetApprovalList.api";

export const useGetApprovalList = (
  pageIndex: number,
  pageSize: number,
  searchValue: string,
  sortColumn: string,
  orderBy: string,
  createdby?: number,
): UseQueryResult<IAdjustmentReportListing> => {
  return useQuery(
    [
      "get-all-adjustment-reports",
      pageIndex,
      pageSize,
      searchValue,
      sortColumn,
      orderBy,
      createdby
    ],
    () =>
      getApprovalList(
        pageIndex,
        pageSize,
        searchValue,
        sortColumn,
        orderBy,
        createdby
      ),
    {
      keepPreviousData: true,
    }
  );
};
