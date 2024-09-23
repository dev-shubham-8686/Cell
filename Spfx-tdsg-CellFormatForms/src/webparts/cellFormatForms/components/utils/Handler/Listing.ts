import { ITroubleReportDetails } from "../../TroubleReport/Form";
import { AxiosInstance as axios  , handleAPIError, handleAPISuccess } from ".";
// import axios from "axios";
import { Message, ServiceUrl, sessionExpiredStatus } from "../../GLOBAL_CONSTANT"
import { get } from "@microsoft/sp-lodash-subset";
import { downloadExcelFile } from "../utility";
import displayjsx from "../displayjsx";
import { IAPIResponse } from "./interface";

const baseURL = ServiceUrl;
  
  export interface IPagination {
    pageIndex: number;
    pageSize: number;
    order: string;
    orderBy: string;
    searchColumn?: string;
    searchValue?: string;
  }
  
  export interface IGetTroubleReportListing {
    key: number;
    id: number;
    title: string;
    description: string;
    Status:string;
    isEditable:boolean;
  }
  
  export type IGetTroubleRequestsResponse = {
    items: IGetTroubleReportListing[];
    totalCount: number;
  };

  export const getTroubleReportListing = async (
    createdOne: number,
    pagination: IPagination
  ): Promise<IGetTroubleRequestsResponse | null> => {
    try {
       
      const response = await axios.get(
        `/api/TroubleReport/Trouble`,
        {
          params: {
            createdOne,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            order: pagination.order,
            orderBy: pagination.orderBy,
            searchColumn: pagination.searchColumn,
            searchValue: pagination.searchValue, 
          },
        }
      );
      
      // if (sessionExpiredStatus.includes(response.data.StatusCode)) {
      //   void displayjsx.showErrorMsg(response.data.Message);
      // }
       
      console.log("TrobuleListing handler Res",response)
       
      let totalCount = 0;
      let items: IGetTroubleReportListing[] = []
       
      if (response.data?.length > 0) {
         
        const data: Array<IGetTroubleReportListing> = response.data;
         
        totalCount = response.data[0].totalCount;
         
        items = data.map((record, index) => {
          
          return {
            key: index,
            ...record,
          };
        });
        return {
          items: items,
          totalCount: totalCount,
        };
      }
      return { items: [], totalCount: 0 }; 
    
     
    } catch (error) {
      console.error('Error fetching trouble report listing:', error);
      if (sessionExpiredStatus.includes(error.response.data.StatusCode)) {
          void displayjsx.showErrorMsg(error.response.data.Message);
        }
     // handleAPIError(error);
      
      return null;
    }
  };
  
  export const getReviseDataListing = async (
    troubleReportId:number
  ) => {
    try {
      
      const response = await axios.get(
        `/api/TroubleReport/TroubleReviseList`,
        {
          params: {
            troubleReportId:troubleReportId
          },
        }
      );
      console.log("RevisedDataListing handler Res",response)
      
     
      
      if (response.data?.length > 0) {
        
        const data = response.data;
        
       return data;
       
      }
      return null; 
    
     
    } catch (error) {
      console.error('Error fetching trouble report listing:', error);
      handleAPIError(error);
      return null;
    }
  };

  export const getTroubleReviewListing = async (
    createdOne: number,
    pagination: IPagination
  ): Promise<IGetTroubleRequestsResponse | null> => {
    try {
        
      const response = await axios.get(
        `/api/TroubleReport/TroubleReview`,
        {
          params: {
            createdOne,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            order: pagination.order,
            orderBy: pagination.orderBy,
            searchColumn: pagination.searchColumn,
            searchValue: pagination.searchValue,
          },
        }
      );
      
      let totalCount = 0;
      let items: IGetTroubleReportListing[] = []
      
      if (response.data?.length > 0) {
        
        const data: Array<IGetTroubleReportListing> = response.data;
        
        totalCount = response.data[0].totalCount;
        
        items = data.map((record, index) => {
          
          return {
            key: index,
            ...record,
          };
        });
        return {
          items: items,
          totalCount: totalCount,
        };
      }
      return { items: [], totalCount: 0 }; 
    
     
    } catch (error) {
      console.error('Error fetching trouble report listing:', error);
      if (sessionExpiredStatus.includes(error.response.data.StatusCode)) {
        void displayjsx.showErrorMsg(error.response.data.Message);
      }
      // handleAPIError(error);
      return null;
    }
  };

  export const getTroubleAppprovalListing = async (
    createdOne: number,
    pagination: IPagination
  ): Promise<IGetTroubleRequestsResponse | null> => {
    try {
        
      const response = await axios.get(
        `/api/TroubleReport/TroubleApprover`,
        {
          params: {
            createdOne,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            order: pagination.order,
            orderBy: pagination.orderBy,
            searchColumn: pagination.searchColumn,
            searchValue: pagination.searchValue,
          },
        }
      );
      
      let totalCount = 0;
      let items: IGetTroubleReportListing[] = []
      
      if (response.data?.length > 0) {
        
        const data: Array<IGetTroubleReportListing> = response.data;
        
        totalCount = response.data[0].totalCount;
       
        items = data.map((record, index) => {
          
          return {
            key: index,
            ...record,
          };
        });
        return {
          items: items,
          totalCount: totalCount,
        };
      }
      return { items: [], totalCount: 0 }; 
    
     
    } catch (error) {
      console.error('Error fetching trouble report listing:', error);
      if (sessionExpiredStatus.includes(error.response.data.StatusCode)) {
        void displayjsx.showErrorMsg(error.response.data.Message);
      }
      // handleAPIError(error);
      return null;
    }
  };

  export const ExportToPdf = async (
    fromDate: string,
    toDate:string,
    userId:number,
    tab:number
  ): Promise<boolean> => {
    try {
      const params = {
        params: {
          fromDate: fromDate,
          toDate:toDate,
          employeeId:userId,
          type:tab
        },
      };
      
      const response = await axios.get(
        `/api/TroubleReport/TroubleExcel`,
        params
      );
      
      console.log("EXCEL handler RESPONSE",response)
      
      const data = response.data.ReturnValue;
       downloadExcelFile(data);
      
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
    getTroubleReportListing,
    getTroubleReviewListing,
    getTroubleAppprovalListing,
    getReviseDataListing,
    ExportToPdf,
  };


  
 