import {  ServiceUrl } from "../../GLOBAL_CONSTANT";
import { IAPIResponse } from "./interface";
import { AxiosInstance as axios, handleAPIError, handleAPISuccess } from ".";


const baseURL = ServiceUrl;
  
export interface ISubmitActionPayload {
  troubleReportId: number;
  isSubmit: boolean;
  modifiedBy: number;
}
export interface IWorkflowDetail {
  ApproverTaskId: number;
  FormType: string;
  TroubleReportId: number; // Changed from vehicleRequestId to troubleReportId
  AssignedToUserId: number;
  DelegateUserId: number;
  DelegateBy: number;
  Status: string;
  Role: string;
  DisplayName: string;
  SequenceNo: number;
  ActionTakenDate:string;
  Comments:string;
  CreatedBy: number;
  CreatedDate: string; // Date format
  processName:string;
  IsActive: boolean;
  employeeName: string;
  employeeNameWithoutCode: string;
  email: string;
}  
  
export const getWorkflowDetails = async (
    troubelReportId: number
  ): Promise<IWorkflowDetail[]> => {
    try {
      
      const response = await axios.get(
        `/api/TroubleReport/ApprorverData`,
        {
            params: {
                troubelReportId: troubelReportId,
            },
        }
      );
      console.log("GetWorkflowDetails handler response ",response)
      const data: IWorkflowDetail[] = response.data;
      if (data?.length > 0) return data;
      else return null;
    } catch (error) {
      console.error("Error while fetching the Workflow details", error);
    }
  };


  export interface IApproverTask {
    approverTaskId: number;
    status: string; //this will mostly be InReview
    userId: number;
    seqNumber?:number;
  }
  export const getCurrentApproverTask = async (
    troubleReportId: number,
    userId: number
  ): Promise<IApproverTask> => {
    try {

      const response = await axios.get(
        `/api/TroubleReport/GetCurrentApprover`,
        {
          params: {
            troubleReportId: troubleReportId,
            userId: userId,
          },
        }
      );
      
      console.log("getCurrentApproverTask Res ",response)
      const data: IApproverTask = response.data;
      if (data) return data;
      else return null; 
    } catch (error) {
      console.error(
        "Error while fetching the Current Approver task details of workflow",
        error
      );
    }
  };

  export interface IResubmitPayload extends ISubmitActionPayload {
    isAmendReSubmitTask: boolean;
    approverTaskId: number;
    comment: string;
  }
  export const reSubmitAction = async (
    payload: IResubmitPayload
  ): Promise<IAPIResponse> => {
    try {
      
      const response = await axios.post(
        `/api/TroubleReport/SubmitRequest`,
        payload
      );
      
      console.log("reSubmitAction handler res", response);
  
      const data: IAPIResponse = response.data;
      const handledData = handleAPISuccess(response);
  
      if (!handledData) return null;
      return data;
    } catch (error) {
      console.error("error", error);
      handleAPIError(error);
      return null;
    }
  };

  export const reOpenAction = async (
    troubleReportId: number,
    userId:number
  ): Promise<IAPIResponse> => {
    try {
      
      const response = await axios.post(
        `/api/TroubleReport/TroubleReopen`,null,
        {
          params:{
            troubleReportId,
            userId
          }
        }
      );
      
      console.log("reOpen handler res", response);
      
      const data: IAPIResponse = response.data;
      const handledData = handleAPISuccess(response);
      
      if (!handledData) return null;
      return data;
    } catch (error) {
      console.error("error", error);
      handleAPIError(error);
      return null;
    }
  };

export interface IApproveAskToAmendPayload {
  ApproverTaskId: number;
  CurrentUserId: number;
  type: 1 | 3; // 1 for Approve and 3 for Ask to Amend
  comment: string;
  troubleReportId:number;
}
  export const approveAskToAmendAction = async (
    params: IApproveAskToAmendPayload
  ): Promise<IAPIResponse> => {
    try {
      
      console.log("approveAskToAmendAction payload",params)
      const response = await axios.post(
        `/api/TroubleReport/UpdateApproveAskToAmend`,null,
        {
          params:params
        }
      );
      
      console.log("approveAskToAmendAction handler res", response);
  
      const data = response.data;
     const handledData = handleAPISuccess(response);
      //  await  Message.showSuccess("Successfull");
     if (!handledData) return null;
      return data;
    } catch (error) {
      
      console.error("error", error);
      handleAPIError(error);
      return null;
      // return true;
    }
  };

  export interface IWorkflowActionPayload {
    troubleReportId: number;
    userId: number;
    comment: string;
  } 
  export const pullbackAction = async (
    params: IWorkflowActionPayload
  ): Promise<any> => {
    try {
      
      console.log("PullBackRequest payload", params);
      
      const response = await axios.post(
        `/api/TroubleReport/PullBack`,null,
        {
          params:params
        }
      );
      
      console.log("PullBackRequest handler res", response);
      
      const data = response.data;
      const handledData = handleAPISuccess(response);
  
      if (!handledData) return null;
      return data;
    } catch (error) {
      console.error("error", error);
      handleAPIError(error);
      return null;
      // return true;
    }
  };

  export interface IRejectPayload {
    ApproverTaskId: number;
    CurrentUserId: number;
    type: 2; // 2 for reject
    comment: string;
    troubleReportId:number;
  }
 export  const rejectAction = async (
    params: IRejectPayload
  ): Promise<IAPIResponse> => {
    try {
      console.log("rejectAction payload", params);
     
      const response = await axios.post(
        `/api/TroubleReport/UpdateApproveAskToAmend`,null,
        {
          params:params
        }
      );
      console.log("rejectAction handler res", response);
  
      const data = response.data;
      const handledData = handleAPISuccess(response);
  
      if (!handledData) return null;
      return data;
    } catch (error) {
      console.error("error", error);
      handleAPIError(error);
      return null;
    }
  };
  export default {
    getWorkflowDetails,
    getCurrentApproverTask,
    pullbackAction,
    rejectAction,
    reSubmitAction,
    reOpenAction
  }