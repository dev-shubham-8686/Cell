import { AxiosInstance as axios, handleAPIError, handleAPISuccess } from ".";
import { ServiceUrl } from "../../GLOBAL_CONSTANT";

const baseURL = ServiceUrl;

export interface IHistoryDetail {
    historyId: number;
    action: string;
    comments: string;
    status: string;
    actionTakenBy: number;
    actionTakenDate: string; //12-24-2024 12:12:12
   role: string;
  }
  const getWorkflowHistory = async (
    troubleReportId: any
  ): Promise<IHistoryDetail[]> => {
    try {
      const params = {
        params: {
          troubleReportId: troubleReportId,
        },
      };
      const response = await axios.get( `/api/TroubleReport/GetHistoryData`, params);
      const data: IHistoryDetail[] = response.data;
      console.log("getWorkflowHistory handler res",response)
      if (data?.length > 0) return data;
      else return null;
    } catch (error) {
      console.error(
        "Error while fetching the History details of workflow",
        error
      );
    }
  };

  export default {
    getWorkflowHistory
  }