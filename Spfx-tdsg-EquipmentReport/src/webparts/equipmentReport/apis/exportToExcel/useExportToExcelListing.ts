import { useMutation } from "@tanstack/react-query";
import { downloadExcelFileListing } from "../../utility/utility";
import http from "../../http";
import { EXPORT_TO_EXCEL_LISTING } from "../../URLs";


const exportToExcelListing = async ({ fromdate, toDate,id,tab }: {fromdate:string,toDate:string, id: number; tab: any }) => {
 
  
  const response = await http.get<any>(EXPORT_TO_EXCEL_LISTING, {
    params: { fromDate:fromdate, toDate:toDate, employeeId:id, type:tab },
  });
  
  const data = response.data.ReturnValue;
  
  downloadExcelFileListing(data);
  
  return response.data;
};

const useExportToExcelListing = () =>
  useMutation<string, null,  {fromdate:string,toDate:any, id: number; tab: any }>({
    mutationKey: ["export-to-excel-listing"],
    mutationFn: exportToExcelListing,
  });

export default useExportToExcelListing;
