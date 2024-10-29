import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllAdjustmentReports, IAdjustmentReportListing } from "../api/AdjustmentReportListing.api";

export const useGetAllAdjustmentReports = (
  pageIndex: number,
  pageSize: number,
  searchValue: string,
  sortColumn: string,
  orderBy: string
): UseQueryResult<IAdjustmentReportListing> => {
  return useQuery(
    [
      "get-all-adjustment-reports",
      pageIndex,
      pageSize,
      searchValue,
      sortColumn,
      orderBy,
    ],
    () =>
      getAllAdjustmentReports(
        pageIndex,
        pageSize,
        searchValue,
        sortColumn,
        orderBy
      ),
    {
      keepPreviousData: true,
    }
  );
};
