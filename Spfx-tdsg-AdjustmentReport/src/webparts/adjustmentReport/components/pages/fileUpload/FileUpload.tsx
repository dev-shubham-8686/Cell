import * as React from "react";
import { FC } from "react";
import { Button, message, Spin, Upload, UploadFile } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

// import DeleteFileModal from "./deleteFileModal";
import { useParams } from "react-router-dom";
import { SPHttpClient } from "@microsoft/sp-http";
import DeleteFileModal from "./deleteFileModal";
import { WebPartContext } from "../../../context/WebPartContext";
import displayjsx, { showErrorMsg, showSuccess } from "../../../utils/displayjsx";
import { WEB_URL } from "../../../GLOBAL_CONSTANT";

interface ExtendedUploadFile extends UploadFile {
  size?: number;
  type?: string;
}



interface IFileUpload {
  folderName: string;
  libraryName: string;
  subFolderName?: string;
  files: UploadFile<any>[];
  setIsLoading: (isLoading: boolean) => void;
  onAddFile: (documentName: string, documentFilePath: string,file:File) => void;
  onRemoveFile: (documentName: string) => void;
  disabled?: boolean; // disabled when mode is view and submitted
  isLoading?: boolean;
  isEmailAttachments?:boolean;
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
  isEmailAttachments
}) => {
  const VALIDATIONS = {
    attachment: {
      fileSize: 11534336 , // 31 MB cause max size is 30 MB
      fileSizeErrMsg: "File size must be less than or equal to 10 MB!",
      fileNamingErrMsg: "File must not contain Invalid Characters(*'\"%,&#^@)!",
      notallowedFileTypes: "application/x-msdownload",
      uploadAcceptTypes: ".jpeg,.pdf,.jpg,.png,.xlsx,.xls,.msg,.eml",
      noOfFiles: `Maximum 10 Files are  allowed! `,
      maxFileCount: 10,
      emailAttachment:  [".eml", ".msg", ".oft"]
    },
  };
  console.log("DISABLEUPLOAD", disabled);
  const webPartContext = React.useContext(WebPartContext);
  const [itemLoading, setItemLoading] = React.useState(false);
console.log("FILES",files)

  const onBeforeUpload = (file: ExtendedUploadFile): boolean | string => {
    const maxSize = VALIDATIONS.attachment.fileSize;
    let description = null;
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    const isDuplicate = files.some(
      (uploadedFile) => uploadedFile.name.toLowerCase() === fileName
    );
    if (isDuplicate) {
      description = "This file has already been uploaded.";
    }
    
    if (files.length >= VALIDATIONS.attachment.maxFileCount) {
      description = ` ${VALIDATIONS.attachment.noOfFiles}`;
    }

    if (file.size && file.size > maxSize) {
      description = ` ${VALIDATIONS.attachment.fileSizeErrMsg}`;
    } else if (/[*'",%&#^@]/.test(file.name)) {
      description = `${VALIDATIONS.attachment.fileNamingErrMsg}`;
    }
   // Check file type
   
    if(isEmailAttachments && !VALIDATIONS.attachment.emailAttachment.includes(fileExtension)){
      description= "Only Email Attachments are allowed. "
    }
    
    else if (
      file.type &&
      VALIDATIONS.attachment.notallowedFileTypes==file.type
    ) {
      description = `exe Files are not allowed.`;
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
      
      const fileData = await response.json();
      const itemId = fileData.d.Id;
      
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
        
        if (!deleteResponse.ok) {
          console.error(`Error deleting file: ${deleteResponse.statusText}`);
        } else {
          
           
          onRemoveFile(file.name);
          
           void displayjsx.showSuccess("File deleted successfully ");
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
      
      setItemLoading(true);
      if (!webPartContext) {
        throw new Error("SharePoint context is not available.");
      }
      
      const url = `${WEB_URL}/_api/Web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}')/Files/Add(url='${fileName}', overwrite=true)?$expand=ListItemAllFields`;
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
        
        const jsonResponse = await response.json();
        const fullPath = jsonResponse.ServerRelativeUrl;
        
        onAddFile(
          jsonResponse.Name,
          fullPath.substring(fullPath.indexOf(`/${libraryName}`)
          ),
          file
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
      
      if (!webPartContext) {
        throw new Error("SharePoint context is not available.");
      }

      const checkOrCreateFolder = async (folderUrl: string) => {
        
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
      
      // check if folder exists
      const checkFolderUrl = `${WEB_URL}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Folders('${folderName}')`;
      await checkOrCreateFolder(checkFolderUrl);

      const subfolderUrl = `${WEB_URL}/_api/Web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${subFolderName}'))`;
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
      
      if (checkSubFolderResponse.status >= 400) {
        
        // Folder does not exist, create it
        const subFolderCreateUrl = `${WEB_URL}/_api/Web/Folders/add('${libraryName}/${folderName}/${subFolderName}')`;
        await webPartContext.spHttpClient
          .post(subFolderCreateUrl, SPHttpClient.configurations.v1, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;odata=verbose",
            },
          })
          .catch((err) => console.error(err));
      }
      
      // Adding the file inside the created folder
      const uploadResult = uploadFile(file, fileName);
      return uploadResult;
    } catch (error) {
      console.error(error);
    }
  };

  const onUpload = async (event: any) => {
    try {
      
      setIsLoading(true);

      if (
        event.file.status !== "uploading" &&
        event.file.status !== "removed"
      ) {
        const file = event.file as File;
        
        const res = await uploadAttachment(file, file.name);
        
        return res;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error while uploading the file: ", error);
    } finally {
      setIsLoading(false);
    }
  };
console.log("FILESSS",files)
  return (
    < >
      {itemLoading && <Spin />}

      <Upload
        maxCount={10}
        className="custom-upload"
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
        <Button    disabled={disabled} icon={<UploadOutlined />}>
          Attach Document
        </Button>
      </Upload>
    </>
  );
};

export default FileUpload;
