export const SERVICE_URL = 
  // "http://localhost:5246"
 "https://localhost:44353"
//  "https://cellformservice-stage.tdsgj.co.in"   //stage
//  "https://tdsg-eapp-cellforms.tdsgj.co.in" // prod
;
// TODO: change URLs
export const WEB_URL = 
// "https://synopsandbox.sharepoint.com/sites/Training2024"
// "https://synopsandbox.sharepoint.com/sites/e-app-stage"
"https://tdsgj.sharepoint.com/sites/e-app-stage" //stage
// "https://tdsgj.sharepoint.com/sites/e-app"   // prod


export const DOCUMENT_LIBRARIES = {
  Material_Consumption_SLIP_Attachments: "MaterialConsumptionSlipDocuments",
};

export const DATE_FORMAT = "dd-MM-yyyy";
export const EXCEL_DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
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