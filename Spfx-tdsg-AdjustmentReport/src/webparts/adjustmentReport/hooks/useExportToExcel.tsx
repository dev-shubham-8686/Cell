import { useMutation } from "@tanstack/react-query";
import { exportToExcelListing, ExportToExcelParams } from "../api/ExportToExcel.api";

const useExportToExcelListing = () =>
  useMutation<void, null, ExportToExcelParams>({
    mutationKey: ["export-to-excel-listing"],
    mutationFn: exportToExcelListing,
  });

export default useExportToExcelListing;
