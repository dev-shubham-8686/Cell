import * as moment from "moment";
import { basePath } from "../GLOBAL_CONSTANT";
import apiClient from "../utils/axiosInstance";
import { IAdjustmentReportInfo } from "./IAdjustmentReport";

export interface IAdjustmentReportListing {
  StatusCode: number;
  Message: string;
  ReturnValue: IAdjustmentReportInfo[];
}

export const getAllAdjustmentReports = async (
  pageIndex: number,
  pageSize: number,
  searchValue: string,
  sortColumn?: string,
  orderBy?: string
): Promise<IAdjustmentReportListing> => {
  const response = await apiClient.get<IAdjustmentReportListing>(
    `${basePath}/api/AdjustmentReport/GetAllAdjustmentData`,
    {
      params: {
        pageIndex,
        pageSize,
        searchValue,
        ...(sortColumn && { sortColumn }),
        ...(orderBy && { orderBy }),
      },

    }


  );

  const formattedData = response.data.ReturnValue?.map(
    (item: any, index: number) => ({
      Key: index + 1,
      ReportNo: item.ReportNo,
      AdjustmentReportId : item.AdjustmentReportId,
      EmployeeName: item.EmployeeName,
      DepartmentName: item.DepartmentName,
      DivisionName: item.DivisionName,
      EmployeeCode: item.EmployeeCode,
      EmpDesignation: item.EmpDesignation,
      Status: item.Status,
      CreatedBy: item.CreatedBy,
      CreatedDate: moment(item.CreatedDate).format("MM-DD-YYYY"),
    })
  );

  return {
    StatusCode: response.data.StatusCode,
    Message: response.data.Message,
    ReturnValue: formattedData,
  };
};
