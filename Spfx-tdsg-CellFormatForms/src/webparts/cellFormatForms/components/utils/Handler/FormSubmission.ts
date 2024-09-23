import { AxiosInstance as axios, handleAPIError, handleAPISuccess } from ".";
import { sessionExpiredStatus } from "../../GLOBAL_CONSTANT";
import { ITroubleReportDetails } from "../../TroubleReport/Form";
import { AxiosResponse } from "axios";
import formatter from "./formatter";
import displayjsx from "../displayjsx";
import { redirectToHome } from "../utility";

export type ITroubleReportPayload = ITroubleReportDetails;
export const InsertUpdateTroubleReportSection = async (
  payload: ITroubleReportPayload,
  showMessage: boolean = true
): Promise<any> => {
  try {
    console.log("InsertUpdateTroubleReportSection payload", payload);
    const headers = {
      "Content-Type": "application/json",
      // Add any other headers if required
    };

    const response: AxiosResponse<any> = await axios.post(
      `/api/TroubleReport/AddOrUpdate`,
      payload,
      { headers }
    );
    const data = response.data;
    console.log("Save handler Response", response);

    void handleAPISuccess(response, showMessage);
    if (!data) return null;

    return data;
  } catch (error) {
    console.error("Error inserting/updating trouble report:", error);
    handleAPIError(error);
    return null;
  }
};

export interface IReviewManagerPayload {
  userId: number;
  troubleReportId: number;
  status: string;
  comment: string;
}
export const onReview = async (
  payload: IReviewManagerPayload
): Promise<any> => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response: AxiosResponse<any> = await axios.post(
      `/api/TroubleReport/ManagerReviewTask`,
      null,
      {
        headers,
        params: {
          troubleReportId: payload.troubleReportId,
          userId: payload.userId,
          status: payload.status,
          comment: payload.comment,
        },
      }
    );
    void handleAPISuccess(response);
    const data: any = response.data;

    if (!data) return null;

    //  await Message.showSuccess("Successful");
    return data;
  } catch (error) {
    console.error("Error inserting/updating trouble report:", error);
    handleAPIError(error);
    return null;
  }
};

export interface ISendToManagerPayload {
  userId: number;
  troubleReportId: number;
}
export const sendToManager = async (
  payload: ISendToManagerPayload
): Promise<any> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      // Add any other headers if required
    };

    const response: AxiosResponse<any> = await axios.post(
      `/api/TroubleReport/SendToManager`,
      null,
      {
        headers,
        params: {
          troubleReportId: payload.troubleReportId,
          userId: payload.userId,
        },
      }
    );
    void handleAPISuccess(response);
    const data: any = response.data;
    console.log("sendto manager handler response", response);

    if (!data) return null;

    // await Message.showSuccess("Successfull");
    return data;
  } catch (error) {
    console.error("Error inserting/updating trouble report:", error);
    handleAPIError(error);
    return null;
  }
};

export const NotifytoMembers = async (
  payload: ISendToManagerPayload
): Promise<any> => {
  try {
    console.log("NotifytoMembers payload", payload);
    const headers = {
      "Content-Type": "application/json",
      // Add any other headers if required
    };

    const response: AxiosResponse<any> = await axios.post(
      `/api/TroubleReport/NotifyWorkDoneMembers`,
      null,
      {
        headers,
        params: {
          troubleReportId: payload.troubleReportId,
          userId: payload.userId,
        },
      }
    );
    void handleAPISuccess(response);
    const data: any = response.data;
    console.log("NotifytoMembers handler response", response);

    if (!data) return null;

    //  await Message.showSuccess("Successfull");
    return data;
  } catch (error) {
    console.error("Error inserting/updating trouble report:", error);
    handleAPIError(error);
    return null;
  }
};

export const ReviewbyManagers = async (
  payload: ISendToManagerPayload
): Promise<any> => {
  try {
    console.log("ReviewbyManagers payload", payload);
    const headers = {
      "Content-Type": "application/json",
      // Add any other headers if required
    };

    const response: AxiosResponse<any> = await axios.post(
      `/api/TroubleReport/ReviewByManagers`,
      null,
      {
        headers,
        params: {
          troubleReportId: payload.troubleReportId,
          userId: payload.userId,
        },
      }
    );
    void handleAPISuccess(response);
    const data: any = response.data;
    console.log("ReviewbyManagers handler response", response);

    if (!data) return null;

    //await Message.showSuccess("Successfull");
    return data;
  } catch (error) {
    console.error("Error inserting/updating trouble report:", error);
    handleAPIError(error);
    return null;
  }
};

export const submitTroubleReport = async (
  payload: TroubleReportSubmitPayload
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `/api/TroubleReport/SubmitRequest`,
      payload
    );
    console.log("SubmitReport handler response", response);
    const data: any = response.data;
    void handleAPISuccess(response);
    // await Message.showSuccess("Trouble report created Successfully");
    return data;
  } catch (error) {
    console.error("Error submitting trouble report:", error);
    handleAPIError(error);
    throw error;
  }
};

export const getCurrentAprrovalRole = async (
  payload: ISendToManagerPayload
): Promise<any> => {
  try {
    console.log("getCurrentAprrovalRole Payload", payload);
    const headers = {
      "Content-Type": "application/json",
    };

    const response: AxiosResponse<any> = await axios.get(
      `/api/TroubleReport/GetCurrentTask`,
      {
        params: {
          troubleReportId: payload.troubleReportId,
          userId: payload.userId,
        },
      }
    );

    const data: any = response.data;
    console.log("getCurrentAprrovalRole handler Response", response);

    return data;
  } catch (error) {
    console.error("Error inserting/updating trouble report:", error);

    return null;
  }
};

export const getTroubleReport = async (
  reportId: number
): Promise<ITroubleReportDetails | null> => {
  try {
    //
    const response = await axios.get(
      `/api/TroubleReport/GetById?Id=${reportId}`
    );
    console.log("getTroubleReportbyId handler res", response);
    //
    const data = response.data.ReturnValue;
    let updatedData = null;
    if (data) {
      updatedData = formatter.Payload_toTroubleReport(data);
    }
    // const handledData = handleAPISuccess(data);
    // if (!handledData) return null;

    return updatedData;
  } catch (error) {
    console.error("Error fetching trouble report:", error);
    if (sessionExpiredStatus.includes(error.response.data.StatusCode)) {
      void displayjsx.showErrorMsg(error.response.data.Message);
      redirectToHome();
    } else {
      handleAPIError(error);
    }
    return null;
  }
};

export const DeleteTroubleReport = async (reportId: number): Promise<any> => {
  try {
    //
    const response = await axios.delete(
      `/api/TroubleReport/Delete?Id=${reportId}`
    );
    console.log("delete trouble handler res", response);
    //
    void handleAPISuccess(response);

    // const handledData = handleAPISuccess(data);
    // if (!handledData) return null;

    return null;
  } catch (error) {
    console.error("Error fetching trouble report:", error);
    if (sessionExpiredStatus.includes(error.response.data.StatusCode)) {
      void displayjsx.showErrorMsg(error.response.data.Message);
      redirectToHome();
    } else {
      handleAPIError(error);
    }
    return null;
  }
};
export const getAllTroubleReports = async (): Promise<
  ITroubleReportDetails[] | null
> => {
  try {
    const response: AxiosResponse<ITroubleReportDetails[]> = await axios.get(
      "/getAllTroubleReports"
    );

    const data: ITroubleReportDetails[] = response.data;
    const handledData = handleAPISuccess(data);

    if (!handledData) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching trouble reports:", error);
    handleAPIError(error);
    return null;
  }
};
export interface TroubleReportSubmitPayload {
  troubleReportId: number;
  isSubmit: boolean;
  isAmendReSubmitTask: boolean;
  approverTaskId?: number;
  modifiedBy?: number;
  comment?: string;
}

export default {
  onReview,
  sendToManager,
  NotifytoMembers,
  getCurrentAprrovalRole,
  ReviewbyManagers,
  InsertUpdateTroubleReportSection,
  getTroubleReport,
  submitTroubleReport,
};
