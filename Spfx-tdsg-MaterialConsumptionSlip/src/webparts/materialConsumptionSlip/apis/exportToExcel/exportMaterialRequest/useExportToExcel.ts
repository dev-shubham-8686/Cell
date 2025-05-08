import { useMutation } from "@tanstack/react-query";

import { EXPORT_TO_EXCEL } from "../../../URLS";
import http from "../../../http";
import { downloadExcelFile } from "../../../utility/utility";
import displayjsx from "../../../utility/displayjsx";

const exportToExcel = async ({
  id,
  materialNo,
}: {
  id: number;
  materialNo: any;
}) => {
  const response = await http.get<any>(EXPORT_TO_EXCEL, {
    params: { materialConsumptionId: id },
  });

  const data = response.data.ReturnValue;

  if (response?.data?.StatusCode === 7) {
    void displayjsx.showSuccess(response?.data?.Message ?? "");
  }

  downloadExcelFile(data, materialNo);

  return response.data;
};

const useExportToExcel = () =>
  useMutation<string, null, { id: number; materialNo: any }>({
    mutationKey: ["export-to-excel"],
    mutationFn: exportToExcel,
  });

export default useExportToExcel;
