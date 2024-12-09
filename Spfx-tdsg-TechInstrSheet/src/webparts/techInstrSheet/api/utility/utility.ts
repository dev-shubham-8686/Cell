import { saveAs } from "file-saver";
import { REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import  { showInfo } from "./displayjsx";
//import * as React from "react";
//import { WebPartContext } from "../../context/WebPartContext";
import { SPHttpClient } from "@microsoft/sp-http";


export  const create_UUID = (): string => {
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

  export const downloadExcelFile = (value: any,materialNo:string): void => {
  
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
      const filename = `${materialNo}_${todayDate}.xlsx`;
      
      saveAs(blob, filename);
    } else {
      console.error("Failed to download file:");
    }
  };

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
      const filename = `TechnicalInstruction${todayDate}.xlsx`;
      
      saveAs(blob, filename);
    } else {
      console.error("Failed to download file:");
    }
  };
  export const downloadPDF = (value: any,materialNo:string): void => {
  
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
      const filename = `${materialNo}_${todayDate}.pdf`;
      
      saveAs(blob, filename);
    } else {
      console.error("Failed to download file:");
    }
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

  export const redirectToHome = (infoMessgae?: string): void => {
    void showInfo(infoMessgae ?? "Redirecting you to homepage...");
  
    setTimeout(() => {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.split("#")[0];
  
      window.location.href = baseUrl;
    }, 2000);
  };
  
  export  const renameFolder = async (
    libraryname: string,
    absUrl: string,
    client: SPHttpClient | null,
    oldFolderName: string,
    newFolderName: string
  ): Promise<void> => {

    if(client != null){
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
console.log("folderData", folderData);
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
      __metadata: { type: "SP.Data.TechnicalSheetDocsItem" },
      Title: newFolderName,
      FileLeafRef: newFolderName,
    }),
  }
);

if (!renameResponse.ok) {
  console.error(`Error renaming folder: ${renameResponse.statusText}`);
}

console.log("Folder renamed successfully");
    }
    
  };

  // Function to convert Base64 string to a File (Blob)
  export function convertBase64ToFile(base64String:any, fileName:any) {
    const byteCharacters = atob(base64String); // Decode base64 string to binary data
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, Math.min(offset + 1024, byteCharacters.length));
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    // Create a Blob object and then create a File object from it
    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    return new File([blob], fileName, { type: 'application/pdf' });
  }
  // Function to generate unique filename with timestamp
 export function generateUniqueFileNameWitCtiNumber(ctiNumber:string) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, ''); // ISO format without special characters
  return `${ctiNumber}-${timestamp}.pdf`; // Append timestamp to CTI number for uniqueness
 }

 // Function to get Base64 string from Blob URL
 export const getBase64StringFromBlobUrl = (url: string): Promise<string> => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = () => reject("Error converting to Base64");
      });
    });
};


  
  export default {
    redirectToHome,
    downloadPDF,
    downloadExcelFile,
    create_UUID,
    renameFolder,
    convertBase64ToFile,
    generateUniqueFileNameWitCtiNumber,
    getBase64StringFromBlobUrl
  };
