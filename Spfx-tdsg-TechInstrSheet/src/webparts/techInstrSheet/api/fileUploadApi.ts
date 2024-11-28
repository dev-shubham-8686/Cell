import { UploadFile } from "antd";
import { SPHttpClient } from "@microsoft/sp-http";
import { WEB_URL } from "../GLOBAL_CONSTANT";

// Define types for your validation and file operations
interface ValidationResults {
  isValid: boolean;
  message?: string;
}

export const VALIDATIONS = {
  attachment: {
    fileSize: 5000000,
    fileSizeErrMsg: "File size must be less than or equal to 5 MB!",
    fileNamingErrMsg: "File must not contain Invalid Characters(*'\"%,&#^@)!",
    allowedFileTypes: [
      "image/jpeg",
      "application/pdf",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MS Excel (xlsx)
      "application/vnd.ms-excel", // MS Excel (xls)
      "application/vnd.ms-outlook", // .msg (Outlook email)
      "message/rfc822" // .eml (generic email)
    ],
    uploadAcceptTypes: ".jpeg,.pdf,.jpg,.png,.xlsx,.xls,.msg,.eml",
    noOfFiles: "Maximum 2 Files are allowed!",
    maxFileCount: 2,
  },
};

export const validateFile = (file: UploadFile, existingFiles: UploadFile[]): ValidationResults => {
  const maxSize = VALIDATIONS.attachment.fileSize;

  if (existingFiles.length >= VALIDATIONS.attachment.maxFileCount) {
    return { isValid: false, message: VALIDATIONS.attachment.noOfFiles };
  }

  if (file.size && file.size > maxSize) {
    return { isValid: false, message: VALIDATIONS.attachment.fileSizeErrMsg };
  }

  if (/[*'",%&#^@]/.test(file.name)) {
    return { isValid: false, message: VALIDATIONS.attachment.fileNamingErrMsg };
  }

  if (
    file.type &&
    !VALIDATIONS.attachment.allowedFileTypes.some((type) => type === file.type)
  ) {
    return { isValid: false, message: "Only JPEG, PDF, JPG, PNG, Excel, and Email Attachments are allowed." };
  }

  return { isValid: true };
};

export const uploadFile = async (webPartContext: any, libraryName: string, folderName: string, file: File, fileName: string, subFolderName: string = ""): Promise<boolean> => {
  try {
    let url = "";
    if(subFolderName === ""){
       url = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/folders('${folderName}')/Files/Add(url='${fileName}', overwrite=true)?$expand=ListItemAllFields`;
    }else{
       url = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}')/Files/Add(url='${fileName}', overwrite=true)?$expand=ListItemAllFields`;
    }
    const response = await webPartContext.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;odata=verbose",
      },
      body: file,
    });

    if (response.status !== 200) {
      console.error(`Error while uploading attachment ${fileName}. Error code: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const downloadFile = (file: UploadFile): void => {
  const url = file.url ? file.url : URL.createObjectURL(file.originFileObj as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
};

export const previewFile = (file: UploadFile, libraryName: string, folderName: string, subFolderName: string = ""): void => {
  let sharePointUrl = "";
  
  if(subFolderName == ""){
    sharePointUrl = file.url
    ? file.url
    : `${WEB_URL}/${libraryName}/${folderName}/${encodeURIComponent(file.name)}`;
  }else{
    sharePointUrl = file.url
    ? file.url
    : `${WEB_URL}/${libraryName}/${folderName}/${subFolderName}/${encodeURIComponent(file.name)}`;
  }
  

  window.open(sharePointUrl, "_blank");
};

export const checkAndCreateFolder = async (webPartContext: any, libraryName: string, folderName: string, subFolderName: string = "") => {
  const checkFolderUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Folders('${folderName}')`;
  const checkFolderResponse = await webPartContext.spHttpClient.get(checkFolderUrl, SPHttpClient.configurations.v1, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;odata=verbose",
    },
  });

  if (checkFolderResponse.status === 404) {
    // Folder does not exist, create it
    const folderCreateUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Folders/Add('${folderName}')`;
    await webPartContext.spHttpClient.post(folderCreateUrl, SPHttpClient.configurations.v1, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;odata=verbose",
      },
    });
  }


  if(subFolderName !== ""){
    let checkSubFolderUrl;
    checkSubFolderUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}')`;

    const checkSubFolderResponse = await webPartContext.spHttpClient.get(
      checkSubFolderUrl,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;odata=verbose",
        },
      }
    );

    if (checkSubFolderResponse.status === 404) {
      let subFolderCreateUrl;
      subFolderCreateUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/Folders/add('${libraryName}/${folderName}/${subFolderName}')`;
      
      await webPartContext.spHttpClient
        .post(subFolderCreateUrl, SPHttpClient.configurations.v1, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;odata=verbose",
          },
        })
        .catch((err:any) => console.error(err));
    }

  }
};
