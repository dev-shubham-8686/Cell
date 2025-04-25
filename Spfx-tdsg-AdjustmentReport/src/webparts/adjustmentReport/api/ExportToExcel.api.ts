import { basePathwithprefix } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { downloadExcelFileListing } from "../utils/utility";

export interface ExportToExcelParams {
  fromdate: string;
  toDate: string;
  id: number;
  tab: any;
}

export const exportToExcelListing = async ({
  fromdate,
  toDate,
  id,
  tab,
}: ExportToExcelParams): Promise<void> => {
  const response = await apiClient.get<any>(
    `${basePathwithprefix}/AdjustmentReport/AdjustmentExcelListing`,
    {
      params: { fromDate: fromdate, toDate, employeeId: id, type: tab },
    }
  );

  const data = response.data.ReturnValue;

  downloadExcelFileListing(data);
};
