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

// TODO: change URLs
export const WEB_URL =
  //"https://synopsandbox.sharepoint.com/sites/Training2024"
  // "https://synopsandbox.sharepoint.com/sites/e-app-stage";
  "https://tdsgj.sharepoint.com/sites/e-app-stage";
// "https://tdsgj.sharepoint.com/sites/e-app";

export const DOCUMENT_LIBRARIES = {
  Technical_Attachment: "TechnicalSheetDocs",
  Technical_Attachment__Related_Document: "RelatedDocuments",
  Technical_Attachment__Outline_Attachment: "OutlineAttachment",
  Technical_Attchment__Closure_Attachment: "ClosureAttachment",
  Technical_Attchment__NotificationPdf_Attachment: "NotificationPdf_Attachment",
};

export const SERVICE_URL =
  //"http://localhost:5246"
  // "https://tdsg-eapp-cellforms.tdsgj.co.in";
  //"https://cellformservice-qa.tdsgj.co.in/"
  "https://cellformservice-stage.tdsgj.co.in";
//"https://localhost:7190"
//"https://localhost:7190/api/Technical"

//export const TECNICAL_API_SERVICE_URL = "https://localhost:7190/api/Technical";
export const TECNICAL_API_SERVICE_URL =
  "https://cellformservice-stage.tdsgj.co.in/api/Technical";
// "https://tdsg-eapp-cellforms.tdsgj.co.in/api/Technical";

//export const TECNICAL_ROOT_SERVICE_URL = "https://localhost:7190";
export const TECNICAL_ROOT_SERVICE_URL =
  "https://cellformservice-stage.tdsgj.co.in";
// "https://tdsg-eapp-cellforms.tdsgj.co.in";

export const DATE_FORMAT = "dd-MM-yyyy";
export const EXCEL_DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
export const MY_DATE_TIME_FORMAT = "dd-MM-yyyy HH:mm:ss";
export const REQUEST_STATUS = {
  InReview: "InReview",
  UnderAmendment: "UnderAmendment",
  Cancelled: "Cancelled",
  Draft: "Draft",
  Submit: "Submit",
  Revised: "Revised",
  Reviewed: "Reviewed",
  Completed: "Completed",
  Closed: "Closed",
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
  Closed: "closed",
  Skipped: "pending",
  AutoApproved: "approved",
  Cancelled: "rejected",
  Revised: "pending",
  Submitted: "submitted",
  InProcess: "in-process",
  UnderApproval: "under-approval",
  Reviewed: "reviewed",
};

export const EmailListOfNotifyCellDiv = "digital-team@tdsgj.co.in";
