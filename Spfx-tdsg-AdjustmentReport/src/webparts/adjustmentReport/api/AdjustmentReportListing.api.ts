import * as moment from "moment";
import { basePathwithprefix } from "../GLOBAL_CONSTANT";
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
    `${basePathwithprefix}/AdjustmentReport/GetAllAdjustmentData`,
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
      AreaName : item.AreaName,
      MachineName : item.MachineName,
      SubMachineName : item.SubMachineName,
      Requestor : item.Requestor,
      CurrentApprover : item.CurrentApprover,
      Status: item.Status,
      EmployeeId : item.EmployeeId,
      IsSubmit : item.IsSubmit,
      SectionHeadId : item.SectionHeadId,
      AdvisorId : item.AdvisorId,
      CreatedDate: moment(item.CreatedDate).format("MM-DD-YYYY"),
    })
  );

  return {
    StatusCode: response.data.StatusCode,
    Message: response.data.Message,
    ReturnValue: formattedData,
  };
};
