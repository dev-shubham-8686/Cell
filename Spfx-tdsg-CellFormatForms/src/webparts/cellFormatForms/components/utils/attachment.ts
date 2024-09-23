import { Upload, UploadFile } from "antd";
import { DocumentLibraries, VALIDATIONS, spWebUrl } from "../GLOBAL_CONSTANT";
import displayjsx from "./displayjsx";

export interface IAPIAttachmentData {
  uid: string;
  attachmentId: number;
  status: string;
  name: string;
  url: string;
}

export interface IAttachmentType {
  id: number;
  TRID: number;
  docName: string;
  docFilePath: string;
  inputFile: File;
  createdDate: string;
  isDeleted: boolean;
}

const handleBeforeUpload = (file: UploadFile): boolean | string => {
  const maxSize = VALIDATIONS.attachment.fileSize;
  let description = null;

  if (file.size > maxSize) {
    //if file size exceeds 10MB
    description = ` ${VALIDATIONS.attachment.fileSizeErrMsg}`;
  }
  // if invalid characters in file name
  else if (/[*'",%&#^@]/.test(file.name)) {
    description = `${VALIDATIONS.attachment.fileNamingErrMsg}`;
  }
  // Check file type
  else if (!VALIDATIONS.attachment.allowedFileTypes.includes(file.type)) {
    description = `Only PPT, XLS, JPEG, PDF, JPG, PNG, MP4 files are allowed.`;
  }

  if (description) {
    displayjsx.displayErrorNoti("", description);
    return Upload.LIST_IGNORE;
  }
  return false;
};

export const handlePreviewFile = async (
  file: UploadFile,
  libraryType?: "trouble",
  folderName?: string
): Promise<void> => {
  console.log("handlePreviewFile file:", file);

  if (file.url) {
    const sharePointUrl = file.url.startsWith(spWebUrl)
      ? file.url
      : `${spWebUrl}/${file.url}`;

    window.open(sharePointUrl, "_blank");
  } else {
    let libraryName = "";
    switch (libraryType) {
      case "trouble":
        libraryName = DocumentLibraries.Trouble_Attachments;
        break;
      default:
        libraryName = DocumentLibraries.Trouble_Attachments;
        break;
    }

    const folderNam = folderName ?? "trblreportNo";

    const fileName = encodeURIComponent(file.name);

    const sharePointUrl = `${spWebUrl}/${libraryName}/${folderNam}/${fileName}`;

    window.open(sharePointUrl, "_blank");
  }
};

const handleDownloadFile = (file: UploadFile<any>): void => {
  const url = file.url
    ? file.url
    : URL.createObjectURL(file.originFileObj as Blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = file.name;

  link.click();

  URL.revokeObjectURL(url);
};

export default {
  handleBeforeUpload,
  handlePreviewFile,
  handleDownloadFile,
};
