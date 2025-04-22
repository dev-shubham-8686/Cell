export const DATE_FORMAT = "DD-MM-YYYY";
export const basePath =
  // `https://localhost:44353`;                      //    ---  local
  `https://cellformservice-qa.tdsgj.co.in`; //   ---  QA
// "https://cellformservice-stage.tdsgj.co.in";      //  ----- stage
// "https://tdsg-eapp-cellforms.tdsgj.co.in"; //  -----  prod

export const basePathwithprefix = `${basePath}/api`;

export const GET_LOGIN_SESSION = `${basePath}/api/TroubleReport/GetLoginSession`;
export const GET_USER = `${basePath}/api/AdjustmentReport/GetUserRole`;

export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
export const DATETIME = "dd-MM-yyyy HH:mm:ss";
export const EXCEL_DATE_FORMAT = "YYYY-MM-DD";

export const APP_NAME = "AdjustmentReport.aspx";
export const WEB_URL =
  // "https://synopsandbox.sharepoint.com/sites/Training2024"
  //  "https://synopsandbox.sharepoint.com/sites/e-app-stage"  // -- local
  "https://tdsgj.sharepoint.com/sites/TDSGe-ApplictionQA"; // --QA
//"https://tdsgj.sharepoint.com/sites/e-app-stage"        // -stage
// "https://tdsgj.sharepoint.com/sites/e-app"; // prod

// Process Status
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

export const LEVELS = {
  Level1: 1,
  Level2: 2,
  Level3: 3,
  Level4: 4,
  Level5: 5,
  Level6: 6,
  Level7: 7,
};

export const ACTION_TYPE = {
  Approve: "approve",
  AskToAmend: "amend",
  Deligate: "delegate",
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
  AutoApproved: "autoapproved",
  Cancelled: "rejected",
  Revised: "pending",
  Submitted: "submitted",
  InProcess: "in-process",
  UnderApproval: "under-approval",
  Reviewed: "reviewed",
};

export const OPERATION = {
  Save: "Save",
  Submit: "Submit",
  Resubmit: "Resubmit",
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
  NA: "N/A",
};

export const MESSAGES = {
  approvalInfoMsg:
    "Kindly ensure the Effectiveness Monitoring and Horizontal Deployment (if Any) before approval.",
  notifyManager:
    "Do you wish to proceed with notifying your reporting manager?",
  notifyMembers: "Do you want to proceed with notifying the members?",
  onReviewByManager: "Do you wish to proceed with the reviewal process?",
  onSave: "Are you sure you want to save the form?",
  onSubmit: "Are you sure you want to Submit the form?",
  onReSubmit: "Are you sure you want to resubmit the form?",
  SubmitSuccess: "Adjustment report submitted successfully!",
  onDeleteFile: "Do you want to permanently delete this file?",
  reviewBeforeSubmit:
    "You need to get the report reviewed before you can submit it. Please review the form before proceeding.",
  redirection: "Redirecting you to homepage...",
};

export function getMessage(key: string): string | undefined {
  return MESSAGES[key as keyof typeof MESSAGES];
}

export const DocumentLibraries = {
  Adjustment_Attachments: "AdjustmentDocuments",
};
