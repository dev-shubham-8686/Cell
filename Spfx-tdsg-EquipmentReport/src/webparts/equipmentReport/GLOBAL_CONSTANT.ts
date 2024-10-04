import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { message } from "antd";
import { DefaultOptionType } from "antd/es/select";

export const Context = React.createContext<WebPartContext | null>(null);
export const VERSION = React.createContext<string | null>(null);

// export const TENANT_ID = "eb313930-c5da-40a3-a0f1-d2e000335fb"; //local        TODO: update before deployment
export const TENANT_ID = "77219ffb-1d22-4cd2-8382-b8704196562c"; //stage

export const Message = {
  showError: (text: string) =>
    message.error({
      content: text,
      duration: 5,
      className: "error-msg",
    }),
  showSuccess: (text: string) =>
    message.success({
      content: text,
      duration: 5,
      className: "success-msg",
    }),
  showInfo: (text: string) =>
    message.info({
      content: text,
      duration: 5,
      className: "info-msg",
    }),
};

const arrwebServiceSiteUrl = [
  "http://localhost:59535/TDSGTravelPortal.svc", //dev web service url 1
  "http://localhost:63157/TDSGTravelPortal.svc", //dev web service url 2
  "https://travel-request-qa.tdsgj.co.in/TDSGTravelPortal.svc", // QA web service url
  "https://travel-request-stage.tdsgj.co.in/TDSGTravelPortal.svc", // stage web service url
  // "https://tdsg-eapp.tds-g.co.in/TDSGServiceAEPPL.svc",
  // "https://tdsg-epp-ia-prd.tdsgj.co.in/TDSGIAServiceAEPPL.svc",
] as const;
type IServiceUrl = (typeof arrwebServiceSiteUrl)[number];

export const webServiceSiteUrl: IServiceUrl =
  // "http://localhost:63157/TDSGTravelPortal.svc"; //dev    TODO: update before deployment
  "http://localhost:59535/TDSGTravelPortal.svc"; //dev    TODO: update before deployment
// "https://travel-request-qa.tdsgj.co.in/TDSGTravelPortal.svc";  //qa
// "https://travel-request-stage.tdsgj.co.in/TDSGTravelPortal.svc"; //stage

const arrspWebUrl = [
  "https://synopsandbox.sharepoint.com/sites/e-app-stage", //dev site link
  "https://tdsgj.sharepoint.com/sites/TDSGe-ApplictionQA", //QA site link
  "https://tdsgj.sharepoint.com/sites/e-app-stage", //stage site link
  "https://tdsgj.sharepoint.com/sites/e-app",
] as const;
type IspWebUrl = (typeof arrspWebUrl)[number];

export const spWebUrl: IspWebUrl =
  "https://synopsandbox.sharepoint.com/sites/e-app-stage"; //dev   TODO: update before deployment
// "https://tdsgj.sharepoint.com/sites/TDSGe-ApplictionQA";   //QA
// "https://tdsgj.sharepoint.com/sites/e-app-stage"; //stage

export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
export const DATE_FORMAT = "DD-MM-YYYY";
export const TIME_FORMAT = "HH:mm:ss";

export const DocumentLibraries = {
  TR_Attachments: "TRDocuments",
  Policy_Attachemnts: "TravelPolicyDocuments",
  TC_Attachemnts: "TCDocuments",
};

export const REQUEST_STATUS = {
  InReview: "InReview",
  UnderAmendment: "UnderAmendment",
  Cancelled: "Cancelled",
  Draft: "Draft",
  Submit: "Submit",
  Revised: "Revised",
  Completed: "Completed",
  Close: "Close",
  Skipped: "Skipped",
  Pending: "Pending",
  AutoApproved: "AutoApproved",
  Approved: "Approved",
  Rejected: "Rejected",
};

// It returns the background colour class for the status
export const STATUS_COLOUR_CLASS: { [key: string]: string } = {
  InReview: "in-review",
  UnderAmendment: "under-amendment",
  Draft: "draft",
  Approved: "approved",
  Rejected: "rejected",
  Pending: "pending",
  Completed: "approved",
  Close: "rejected",
  Submit: "in-review",
  Skipped: "pending",
  AutoApproved: "approved",
  Cancelled: "rejected",
  Revised: "pending",
};

export const DASHBOARD_LISTING_PAGESIZE = 10;
export const pageSizeOptions: DefaultOptionType[] = [
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
  { label: "100 / page", value: 100 },
];

export const PROJECT_NAME = "Travel Requisition";
