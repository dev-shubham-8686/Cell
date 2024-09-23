import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DocumentLibraries,
  MESSAGES,
  REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
} from "../GLOBAL_CONSTANT";
import { saveAs } from "file-saver";
import { showInfo } from "./displayjsx";
// import { saveAs } from "file-saver";
// import { AxiosResponse } from "axios";

dayjs.extend(customParseFormat);

export const compareDates = (a: string, b: string): number => {
  const date1 = dayjs(a, "DD-MM-YYYY HH:mm:ss");
  const date2 = dayjs(b, "DD-MM-YYYY HH:mm:ss");
  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
};

export const createTempRefNumber = (employeeId: number): string => {
  return (
    employeeId + "_" + Math.floor(Math.random() * (100000 - 100 + 1) + 100)
  );
};

export const getAttachmentPath = (
  folderName: string,
  fileName: string,
  libraryType?: "troubleReport"
): string => {
  let libraryName = "";

  switch (libraryType) {
    case "troubleReport":
      libraryName = DocumentLibraries.Trouble_Attachments;
      break;

    default:
      libraryName = DocumentLibraries.Trouble_Attachments;
      break;
  }

  const path = `/${libraryName}/${folderName}/${fileName}`; // /TroubleDocuments/TR-2024-00001/Trouble Report.pdf

  return path;
};

const controlKeys = [
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];

export const isControlKeyPressed = (key: string): boolean => {
  return controlKeys.includes(key);
};

export const handleNumberInTextInput = (
  e: React.KeyboardEvent<HTMLInputElement>
): void => {
  const key = e.key;
  if (isControlKeyPressed(key)) {
    return;
  }
  if (!/^\d$/.test(key)) {
    e.preventDefault();
  }
};

export const getStatusColourClass = (status: string): string => {
  return `status-badge-${STATUS_COLOUR_CLASS[status]}`;
};

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
      case REQUEST_STATUS.Close:
        statusText = "Close";
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

export const getNextActiveSection = (
  sectionNo: number,
  activeSectionInBE: number
): number => {
  return sectionNo > activeSectionInBE ? sectionNo : activeSectionInBE;
};

export const downloadExcelFile = (value: any): void => {
  
  if (value && value !== "") {
    const base64String = value;
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const todayDate = new Date().toISOString().split("T")[0];
    const filename = `TroubleReport_${todayDate}.xlsx`;
    
    saveAs(blob, filename);
  } else {
    console.error("Failed to download file:");
  }
};

export const redirectToHome = (infoMessgae?: string): void => {
  void showInfo(infoMessgae ?? MESSAGES.redirection);

  setTimeout(() => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split("#")[0];

    window.location.href = baseUrl;
  }, 2000);
};

export const captureEmailApprovalRedirection = (): string => {
  const url = window.location.href;
  const [baseUrl, queryString] = url.split("?");
// debugger;
  const params = new URLSearchParams(queryString);
  const actionValue = params.get("action");

  if (actionValue) {
    // Removing outlook parameters
    params.delete("action");
    params.delete("CT");
    params.delete("OR");
    params.delete("CID");

    const newUrl = `${baseUrl.split("#")[0]}${
      params.toString() ? "?" + params.toString() : ""
    }${window.location.hash}`;

    // window.location.replace(newUrl);
    window.history.replaceState({ isApproverRequest: true, }, '', newUrl);
  }

  return actionValue;
};


export default {
  compareDates,
  createTempRefNumber,
  getAttachmentPath,
  isControlKeyPressed,
  handleNumberInTextInput,
  displayRequestStatus,
  redirectToHome
};
