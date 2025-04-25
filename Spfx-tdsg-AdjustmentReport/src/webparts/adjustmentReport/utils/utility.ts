import { saveAs } from "file-saver";
import { SPHttpClient } from "@microsoft/sp-http";
import { DocumentLibraries, REQUEST_STATUS } from "../GLOBAL_CONSTANT";
import { showInfo } from "./displayjsx";

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

export const getAttachmentPath = (
  folderName: string,
  fileName: string,
  libraryType?: "troubleReport"
): string => {
  let libraryName = "";

  switch (libraryType) {
    case "troubleReport":
      libraryName = DocumentLibraries.Adjustment_Attachments;
      break;

    default:
      libraryName = DocumentLibraries.Adjustment_Attachments;
      break;
  }

  const path = `/${libraryName}/${folderName}/${fileName}`; // /TroubleDocuments/TR-2024-00001/Trouble Report.pdf

  return path;
};

export const create_UUID = (): string => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

// export const downloadExcelFile = (value: any,materialNo:string): void => {

//   if (value && value !== "") {

//     const base64String = value;
//     const byteCharacters = atob(base64String);
//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     const blob = new Blob([byteArray], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     const todayDate = new Date().toISOString().split("T")[0];
//     const filename = `${materialNo}_${todayDate}.xlsx`;

//     saveAs(blob, filename);
//   } else {
//     console.error("Failed to download file:");
//   }
// };

export const downloadExcelFileListing = (value: any): void => {
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
    const filename = `AdjustmentReport_${todayDate}.xlsx`;

    saveAs(blob, filename);
  } else {
    console.error("Failed to download file:");
  }
};

export const downloadPDF = (value: any, reportNo: string): void => {
  if (value && value !== "") {
    const base64String = value;
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const todayDate = new Date().toISOString().split("T")[0];
    const filename = `${reportNo}_${todayDate}.pdf`;

    saveAs(blob, filename);
  } else {
    console.error("Failed to download file:");
  }
};

export const redirectToHome = (infoMessgae?: string): void => {
  void showInfo(infoMessgae ?? "Redirecting you to homepage...");

  setTimeout(() => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split("#")[0];

    window.location.href = baseUrl;
  }, 2000);
};

export const renameFolder = async (
  libraryname: string,
  absUrl: string,
  client: SPHttpClient,
  oldFolderName: string,
  newFolderName: string
): Promise<void> => {
  // Fetching the item ID of the folder
  const getFolderResponse = await client.get(
    `${absUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryname}/${oldFolderName}')/ListItemAllFields`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=verbose",
        "odata-version": "3.0",
        "Content-type": "application/json;odata=verbose",
      },
    }
  );

  const folderData = await getFolderResponse.json();

  const itemId = folderData.d.Id;

  // Rename the folder
  const renameResponse = await client.post(
    `${absUrl}/_api/web/lists/getbytitle('${libraryname}')/items(${itemId})`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "odata-version": "3.0",
        "X-HTTP-Method": "MERGE",
        "IF-MATCH": "*",
      },
      body: JSON.stringify({
        __metadata: { type: "SP.Data.AdjustmentDocumentsItem" },
        Title: newFolderName,
        FileLeafRef: newFolderName,
      }),
    }
  );

  if (!renameResponse.ok) {
    console.error(`Error renaming folder: ${renameResponse.statusText}`);
  }
};

// Function to convert file to Base64
export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const scrollToElementsTop = (
  className: string = null,
  id: string = null
): void => {
  let scrollToPositionEl;

  if (className) {
    const docEls = document.getElementsByClassName("header");
    if (docEls.length > 0) scrollToPositionEl = docEls[0];
  }

  if (id) scrollToPositionEl = document.getElementById(id);

  if (scrollToPositionEl) {
    scrollToPositionEl.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
};

export default {
  redirectToHome,
  create_UUID,
  renameFolder,
  getBase64,
  scrollToElementsTop,
};
