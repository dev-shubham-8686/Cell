import { useMutation } from "@tanstack/react-query";

import { EXPORT_TO_EXCEL } from "../../../URLS";
import { ICustomAxiosConfig } from "../../../interface";
import http from "../../../http";
import { downloadExcelFile } from "../../../utility/utility";

const exportToExcel = async ({ id, materialNo }: { id: number; materialNo: any }) => {
 
  
  const response = await http.get<any>(EXPORT_TO_EXCEL,{ params: {materialConsumptionId: id } });
  
  const data = response.data.ReturnValue;
  
  downloadExcelFile(data,materialNo);
  
  return response.data;
};

const useExportToExcel = () =>
  useMutation<string, null,  { id: number; materialNo: any }>({
    mutationKey: ["export-to-excel"],
    mutationFn: exportToExcel,
  });

export default useExportToExcel;
