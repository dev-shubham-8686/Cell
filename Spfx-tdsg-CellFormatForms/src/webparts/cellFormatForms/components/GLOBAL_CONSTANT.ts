import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { TableProps, message } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { MessageType } from "./utils/Handler/interface";
// local imports

export const Context = React.createContext<WebPartContext | null>(null);
export const VERSION = React.createContext<string>("");

export const ROW_GUTTER: [number, number] = [16, 16];

export const IA_ADMIN_SITE_GROUP: string = "IA Admin Members";

export const TENANT_ID = "eb313930-c5da-40a3-a0f1-d2e000335fb"; //local        TODO: update before deployment
// export const TENANT_ID = "77219ffb-1d22-4cd2-8382-b8704196562c"; //stage

const arrServiceUrls = [
  "https://localhost:44353", //local
  "https://synopsandbox.sharepoint.com/sites/e-app-stage", //dev
  "https://cellformservice-qa.tdsgj.co.in", //qa
  "https://cellformservice-stage.tdsgj.co.in",                   //stage
  "https://tdsg-eapp-cellforms.tdsgj.co.in",                     //prod
] as const;
type IServiceUrl = (typeof arrServiceUrls)[number];
// current active service url
export const ServiceUrl: IServiceUrl =
  // "https://localhost:44353";                                             //local
  // "https://cellformservice-qa.tdsgj.co.in";                                //qa
  "https://cellformservice-stage.tdsgj.co.in";                                //stage
  // "https://tdsg-eapp-cellforms.tdsgj.co.in"; //prod    TODO: update before deployment

const arrspWebUrl = [
  "https://synopsandbox.sharepoint.com/sites/Training2024",
  "https://synopsandbox.sharepoint.com/sites/e-app-stage",
  "https://tdsgj.sharepoint.com/sites/e-app-stage", //stage
  "https://tdsgj.sharepoint.com/sites/e-app", //prod
] as const;
type IspWebUrl = (typeof arrspWebUrl)[number];

export const spWebUrl: IspWebUrl =
  // "https://synopsandbox.sharepoint.com/sites/Training2024";
  // "https://tdsgj.sharepoint.com/sites/e-app-stage"; //stage
"https://tdsgj.sharepoint.com/sites/e-app";                           //prod   TODO: update before deployment

export const componentMode = {
  Add: "add",
  Edit: "edit",
};

//Process Status
export const ProcessStatus = [
  "approved",
  "rejected",
  "in progress",
  "not started",
] as const;

export const StatusColors = {
  success: "green",
  warning: "#E67E22",
  error: "red",
  info: "blue",
  default: "black",
  na: "Gray",
};

// It returns the background colour class for the status
export const STATUS_COLOUR_CLASS: { [key: string]: string } = {
  InReview: "in-review",
  UnderReview: "under-review",
  UnderAmendment: "under-amendment",
  ReviewDeclined: "review-declined",
  Draft: "draft",
  Approved: "approved",
  Rejected: "rejected",
  Pending: "pending",
  Completed: "completed",
  Close: "rejected",
  Skipped: "pending",
  AutoApproved: "approved",
  Cancelled: "rejected",
  Revised: "pending",
  Submitted: "submitted",
  InProcess: "in-process",
  UnderApproval: "under-approval",
  Reviewed: "reviewed",
};

export const sessionExpiredStatus = [
  MessageType.SessionTimeOut,
  MessageType.Error,
];

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

export type IPermission = {
  createICQPCM: boolean;
  viewICQPCM: boolean;
  createFinancial: boolean;
  viewFinancial: boolean;
  createATC: boolean;
  viewATC: boolean;
  viewCertification: boolean;
};

export const Breakpoints = {
  mobile: "767px",
};

export const DATE_FORMAT = "DD-MM-YYYY";
export const EXCEL_DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";

export const DocumentLibraries = {
  Trouble_Attachments: "TroubleDocuments",
  MaterialConsumption_Attachments: "MaterialConsumptionDocuments",
  ICQ_Attachments: "ICQ_Attachments",
  FIN_Attachments: "FIN_Attachments",
  ATC_Attachments: "ATC_Attachments",
  ICQ_Certi_Attachments: "ICQ_Certi_Attachments",
};

export const VALIDATIONS = {
  attachment: {
    fileSize: 50000000,
    fileSizeErrMsg: "File size must be less than or equal to 50 MB !",
    fileNamingErrMsg: "File must not contain Invalid Characters(*'\"%,&#^@) !",
    allowedFileTypes: [
      "image/jpeg",
      "application/pdf",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // MS PowerPoint (pptx)
      "application/vnd.ms-powerpoint", // MS PowerPoint (ppt)
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MS Excel (xlsx)
      "application/vnd.ms-excel", // MS Excel (xls)
      "video/mp4", // MP4
    ],
    uploadAcceptTypes: ".jpeg,.pdf,.jpg,.png,.pptx,.ppt,.xlsx,.xls,.mp4",
  },
};

export const REQUEST_STATUS = {
  InReview: "InReview",
  UnderAmendment: "UnderAmendment",
  Cancelled: "Cancelled",
  Draft: "Draft",
  Submit: "Submit",
  Revised: "Revised",
  Reviewed: "Reviewed",
  Completed: "Completed",
  Close: "Close",
  Skipped: "Skipped",
  Pending: "Pending",
  AutoApproved: "AutoApproved",
  Approved: "Approved",
  Rejected: "Rejected",
  UnderReview: "UnderReview",
  ReviewDeclined: "ReviewDeclined",
  Submitted: "Submitted",
  InProcess: "InProcess",
  UnderApproval: "UnderApproval",
};

export const Levels = {
  Level0: 0, // lead is not assigned
  Level1: 1, // lead is asssigned
  Level2: 2, // ICA reviewed
  Level3: 3, // RCA reviewed
  Level4: 4, // PCA reviewed
};

export const CommonTableProps: TableProps<any> = {
  bordered: true,
  size: "small",
};
export enum RoleNames {
  ReportingManager = "ReportingManager",
  WorkDoneLead = "WorkDoneLead",
  ReviewReportingManager = "ReviewReportingManager",
  WorkDoneManager = "ReviewWorkDoneManager",
}
export const DASHBOARD_LISTING_PAGESIZE = 10;
export const pageSizeOptions: DefaultOptionType[] = [
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
  { label: "100 / page", value: 100 },
];

export const allowedEditInRequests = [
  REQUEST_STATUS.Draft,
  REQUEST_STATUS.InProcess,
];

export const MESSAGES = {
  approvalInfoMsg:
    "Kindly ensure the Effectiveness Monitoring and Horizontal Deployment (if Any) before approval.",
  notifyManager:
    "Do you wish to proceed with notifying your reporting manager?",
  notifyMembers: "Do you want to proceed with notifying the members?",
  onReviewByManager: "Do you wish to proceed with the reviewal process?",
  onSave: "Are you sure you want to save the form?",
  onSubmit: "Are you sure you want to Submit the form?",
  SubmitSuccess: "Trouble report submitted successfully!",
  onDeleteFile: "Do you want to permanently delete this file?",
  reviewBeforeSubmit:
    "You need to get the report reviewed before you can submit it. Please review the form before proceeding.",
  redirection: "Redirecting you to homepage...",
};
