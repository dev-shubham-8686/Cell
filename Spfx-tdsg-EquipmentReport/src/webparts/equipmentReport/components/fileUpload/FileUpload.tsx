import * as React from "react";
import { FC } from "react";
import { Button, message, Spin, Upload, UploadFile } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

// import DeleteFileModal from "./deleteFileModal";
import { WebPartContext } from "../../context/webpartContext";
import { WEB_URL } from "../../GLOBAL_CONSTANT";
import { useParams } from "react-router-dom";
import displayjsx from "../../utility/displayjsx";
import { SPHttpClient } from "@microsoft/sp-http";
import { showErrorMsg, showSuccess } from "../../utils/displayjsx";
import DeleteFileModal from "./deleteFileModal";

interface ExtendedUploadFile extends UploadFile {
  size?: number;
  type?: string;
}

const VALIDATIONS = {
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
      "message/rfc822", // .eml (generic email)
    ],
    uploadAcceptTypes: ".jpeg,.pdf,.jpg,.png,.xlsx,.xls,.msg,.eml",
    noOfFiles: "Maximum 2 Files are allowed! ",
    maxFileCount: 10,
  },
};

interface IFileUpload {
  folderName: string;
  libraryName: string;
  subFolderName?: string;
  files: UploadFile<any>[];
  setIsLoading: (isLoading: boolean) => void;
  onAddFile: (documentName: string, documentFilePath: string) => void;
  onRemoveFile: (documentName: string) => void;
  disabled?: boolean; // disabled when mode is view and submitted
  isLoading?: boolean;
}

const FileUpload: FC<IFileUpload> = ({
  folderName,
  libraryName,
  subFolderName,
  files,
  setIsLoading,
  onAddFile,
  onRemoveFile,
  disabled,
  isLoading,
}) => {
  console.log("DISABLEUPLOAD", disabled);
  const webPartContext = React.useContext(WebPartContext);
  const [itemLoading, setItemLoading] = React.useState(false);

  const onBeforeUpload = (file: ExtendedUploadFile): boolean | string => {
    const maxSize = VALIDATIONS.attachment.fileSize;
    let description = null;
    if (files.length >= VALIDATIONS.attachment.maxFileCount) {
      description = ` ${VALIDATIONS.attachment.noOfFiles}`;
    }

    if (file.size && file.size > maxSize) {
      description = ` ${VALIDATIONS.attachment.fileSizeErrMsg}`;
    } else if (/[*'",%&#^@]/.test(file.name)) {
      description = `${VALIDATIONS.attachment.fileNamingErrMsg}`;
    }
    // Check file type
    else if (
      file.type &&
      !VALIDATIONS.attachment.allowedFileTypes.some(
        (type) => type === file.type
      )
    ) {
      description = `Only JPEG, PDF, JPG, PNG , Excel and Email Attachments are allowed.`;
    }

    if (description) {
      void displayjsx.showErrorMsg(description);
      // notification.displayErrorNoti("", description);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const onDelete = async (file: UploadFile<any>) => {
    const confirm = await DeleteFileModal(file.name);
    if (confirm) {
      debugger;
      const url = `${webPartContext.pageContext.web.absoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}/${file.name}')/ListItemAllFields`;
      const response = await webPartContext.spHttpClient.post(
        url,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=verbose",
            "odata-version": "3.0",
            "Content-type": "application/json;odata=verbose",
          },
        }
      );
      debugger;
      const fileData = await response.json();
      const itemId = fileData.d.Id;
      debugger;
      if (itemId) {
        const deleteResponse = await webPartContext.spHttpClient.post(
          `${webPartContext.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${libraryName}')/items(${itemId})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=verbose",
              "Content-Type": "application/json;odata=verbose",
              "odata-version": "3.0",
              "X-HTTP-Method": "DELETE",
              "IF-MATCH": "*",
            },
          }
        );
        debugger;
        if (!deleteResponse.ok) {
          console.error(`Error deleting file: ${deleteResponse.statusText}`);
        } else {
          debugger;
          onRemoveFile(file.name);
          debugger
          // void displayjsx.showSuccess("File deleted successfully ");
        }
      }

      return true;
    } else {
      return false;
    }
  };

  const onDownload = (file: UploadFile<any>): void => {
    const url = file.url
      ? file.url
      : URL.createObjectURL(file.originFileObj as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onPreviewFile = async (file: UploadFile): Promise<void> => {
    if (file.url) {
      const sharePointUrl = file.url.startsWith(WEB_URL)
        ? file.url
        : `${WEB_URL}/${file.url}`;
      window.open(sharePointUrl, "_blank");
    } else {
      const fileName = encodeURIComponent(file.name);
      const sharePointUrl = `${WEB_URL}/${libraryName}/${folderName}/${subFolderName}/${fileName}`;

      window.open(sharePointUrl, "_blank");
    }
  };

  const uploadFile = async (file: File, fileName: string): Promise<boolean> => {
    try {
      debugger;
      setItemLoading(true);
      if (!webPartContext) {
        throw new Error("SharePoint context is not available.");
      }

      const url = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}')/Files/Add(url='${fileName}', overwrite=true)?$expand=ListItemAllFields`;
      const response = await webPartContext.spHttpClient.post(
        url,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;odata=verbose",
          },
          body: file,
        }
      );
      // const response:any="";
      if (response.status !== 200) {
        void showErrorMsg(
          `Error while uploading attachment ${fileName}. Error code: ${response.status}`
        );
        return false;
      } else {
        void showSuccess(`The file ${fileName} is uploaded successfully.`);
        debugger;
        const jsonResponse = await response.json();
        const fullPath = jsonResponse.ServerRelativeUrl;
        debugger;
        onAddFile(
          jsonResponse.Name,
          fullPath.substring(fullPath.indexOf(`/${libraryName}`))
        );
        // onAddFile("name","path")
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setItemLoading(false);
    }
  };

  const uploadAttachment = async (file: File, fileName: string) => {
    try {
      debugger;
      if (!webPartContext) {
        throw new Error("SharePoint context is not available.");
      }

      const checkOrCreateFolder = async (folderUrl: string) => {
        debugger
        const checkFolderResponse = await webPartContext.spHttpClient.get(
          folderUrl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;odata=verbose",
            },
          }
        );

        if (checkFolderResponse.status === 404) {
          // Folder does not exist, create it
          await webPartContext.spHttpClient.post(
            folderUrl.replace("/Folders", "/Folders/Add"), // Adjust URL for creation
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json;odata=verbose",
              },
            }
          );
        }
      };
      debugger
      // check if folder exists
      const checkFolderUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Folders('${folderName}')`;
      await checkOrCreateFolder(checkFolderUrl);
debugger
      const subfolderUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}'))`;
      const checkSubFolderResponse = await webPartContext.spHttpClient.get(
        subfolderUrl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;odata=verbose",
          },
        }
      );
      debugger
      if (checkSubFolderResponse.status >= 400) {
        debugger
        // Folder does not exist, create it
        const subFolderCreateUrl = `${webPartContext.pageContext.web.absoluteUrl}/_api/Web/Folders/add('${libraryName}/${folderName}/${subFolderName}')`;
        await webPartContext.spHttpClient
          .post(subFolderCreateUrl, SPHttpClient.configurations.v1, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;odata=verbose",
            },
          })
          .catch((err) => console.error(err));
      }
      debugger
      // Adding the file inside the created folder
      const uploadResult = uploadFile(file, fileName);
      return uploadResult;
    } catch (error) {
      console.error(error);
    }
  };

  const onUpload = async (event: any) => {
    try {
      debugger;
      setIsLoading(true);

      if (
        event.file.status !== "uploading" &&
        event.file.status !== "removed"
      ) {
        const file = event.file as File;
        debugger
        const res = await uploadAttachment(file, file.name);
        debugger
        return res;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error while uploading the file: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {itemLoading && <Spin />}

      <Upload
        maxCount={10}
        disabled={disabled}
        onRemove={onDelete}
        beforeUpload={onBeforeUpload}
        onDownload={onDownload}
        showUploadList={{
          showRemoveIcon: !disabled,
          showPreviewIcon: true,
          showDownloadIcon: true,
          downloadIcon: (
            <DownloadOutlined onClick={(e) => e.stopPropagation()} />
          ),
        }}
        onPreview={onPreviewFile}
        onChange={async (event) => {
          if (event.fileList.length > 0) {
            const res = await onUpload(event);
            // if (res) {
            //   void displayjsx.showSuccess("File uploaded successfully ");
            // }
          }
        }}
        fileList={files}
      >
        <Button disabled={disabled} icon={<UploadOutlined />}>
          Attach Document
        </Button>
      </Upload>
    </>
  );
};

export default FileUpload;
