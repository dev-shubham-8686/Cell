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



export const SERVICE_URL =
  // "https://localhost:44353"; //dev    TODO: update before deployment
  // "https://cellformservice-qa.tdsgj.co.in"   // QA
  "https://cellformservice-stage.tdsgj.co.in"; //stage



export const WEB_URL =
  // "https://synopsandbox.sharepoint.com/sites/Training2024"; //dev   TODO: update before deployment
  // "https://tdsgj.sharepoint.com/sites/TDSGe-ApplictionQA"    // --QA
"https://tdsgj.sharepoint.com/sites/e-app-stage"; //stage

export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
export const DATE_FORMAT = "DD-MM-YYYY";
export const TIME_FORMAT = "HH:mm:ss";
export const EXCEL_DATE_FORMAT = "YYYY-MM-DD";

export const DocumentLibraries = {
  EQ_Report:"EqReportDocuments"
};


export const SEQUENCE = {
  Seq1: 1,
  Seq2: 2,
  Seq3: 3,
  Seq4: 4,
  Seq5: 5,
  Seq6: 6,
}
export const REQUEST_STATUS = {
  PCRNPending:"PCRNPending",
  UnderToshibaApproval:"UnderToshibaApproval",
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
  W1Completed :"W1Completed",
  ResultMonitoring:"ResultMonitoring",
  UnderImplementation:"UnderImplementation",
  LogicalAmendmentInReview:"LogicalAmendmentInReview",
  LogicalAmendment:"LogicalAmendment",
  ToshibaTechnicalReview:"ToshibaTechnicalReview"
};

// It returns the background colour class for the status
export const STATUS_COLOUR_CLASS: { [key: string]: string } = {
  InReview: "in-review",
  UnderAmendment: "under-amendment",
  ToshibaTechnicalReview:"toshiba-technical-review",
  PCRNPending:"pcrn-pending",
  UnderToshibaApproval:"under-toshiba-approval",
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
  LogicalAmendment:"logical-amendment",
  LogicalAmendmentInReview:"logical-amendment-inReview",
  UnderImplementation:"under-implementation",
  ResultMonitoring:"result-monitoring"
};

export const DASHBOARD_LISTING_PAGESIZE = 10;
export const pageSizeOptions: DefaultOptionType[] = [
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
  { label: "100 / page", value: 100 },
];

export const PROJECT_NAME = "Travel Requisition";
