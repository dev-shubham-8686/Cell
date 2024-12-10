import { REQUEST_STATUS } from "../GLOBAL_CONSTANT";

export const displayRequestStatus = (status: string): string => {
  let statusText: string;

  switch (status) {
    case REQUEST_STATUS.Approved:
      statusText = "Approved";
      break;
    case REQUEST_STATUS.AutoApproved:
      statusText = "Auto Approved";
      break;
    case REQUEST_STATUS.Cancelled:
      statusText = "Cancelled";
      break;
    case REQUEST_STATUS.Closed:
      statusText = "Closed";
      break;
    case REQUEST_STATUS.Completed:
      statusText = "Completed";
      break;
    case REQUEST_STATUS.Submitted:
      statusText = "Submitted";
      break;
    case REQUEST_STATUS.Draft:
      statusText = "Draft";
      break;
    case REQUEST_STATUS.InReview:
      statusText = "In Review";
      break;
    case REQUEST_STATUS.ReviewDeclined:
      statusText = "Review Declined";
      break;
    case REQUEST_STATUS.UnderApproval:
      statusText = "Under Approval";
      break;
    case REQUEST_STATUS.InProcess:
      statusText = "In Process";
      break;
    case REQUEST_STATUS.UnderReview:
      statusText = "Under Review";
      break;
    case REQUEST_STATUS.Pending:
      statusText = "Pending";
      break;
    case REQUEST_STATUS.Rejected:
      statusText = "Rejected";
      break;
    case REQUEST_STATUS.Revised:
      statusText = "Revised";
      break;
    case REQUEST_STATUS.Skipped:
      statusText = "Skipped";
      break;
    case REQUEST_STATUS.Submit:
      statusText = "Submit";
      break;
    case REQUEST_STATUS.UnderAmendment:
      statusText = "Under Amendment";
      break;
    default:
      statusText = status;
  }

  return statusText;
};
