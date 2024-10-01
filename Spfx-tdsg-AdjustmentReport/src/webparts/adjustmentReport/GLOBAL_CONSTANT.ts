export const DATE_FORMAT = "DD-MM-YYYY";

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
