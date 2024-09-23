import { SPHttpClient } from "@microsoft/sp-http";
import { AxiosInstance as axios, handleAPIError, handleAPISuccess } from ".";
import { IAPIResponse } from "./interface";
import displayjsx from "../displayjsx";

export interface IAttachmentPayload {
  TroubleAttachmentId:number;
  documentName: string;
  documentFilePath: string;
}

// type IUploadICQAttachmentSPResponse = {
//   "@odata.context": string;
//   "@odata.editLink": string;
//   "@odata.id": string;
//   "@odata.type": string;
//   CheckInComment: string;
//   CheckOutType: number;
//   ContentTag: string;
//   CustomizedPageStatus: number;
//   ETag: string;
//   Exists: boolean;
//   IrmEnabled: boolean;
//   Length: number;
//   Level: number;
//   LinkingUri: string;
//   LinkingUrl: string;
//   ListItemAllFields: {
//     "@odata.editLink": string;
//     "@odata.etag": string;
//     "@odata.id": string;
//     "@odata.type": string;
//     AuthorId: number;
//     CheckoutUserId: null;
//     ComplianceAssetId: null;
//     ContentTypeId: string;
//     Created: Date;
//     EditorId: number;
//     FileSystemObjectType: number;
//     GUID: string;
//     ID: number;
//     Id: number;
//     Modified: Date;
//     OData__CopySource: null;
//     OData__ExtendedDescription: null;
//     OData__UIVersionString: string;
//     ServerRedirectedEmbedUri: null;
//     ServerRedirectedEmbedUrl: string;
//     Title: string;
//   };
//   "ListItemAllFields@odata.navigationLink": string;
//   MajorVersion: number;
//   MinorVersion: number;
//   Name: string;
//   ServerRelativeUrl: string;
//   TimeCreated: Date;
//   TimeLastModified: Date;
//   Title: string;
//   UIVersion: number;
//   UIVersionLabel: string;
//   UniqueId: string;
// };

// const updateMetadataForAttachment = async (
//   libraryName: string,
//   absUrl: string,
//   client: SPHttpClient,
//   itemId: number,
//   metadata: {
//     formValues: Array<{ FieldName: string; FieldValue: any }>;
//     bNewDocumentUpdate: boolean;
//   }
// ): Promise<void> => {
//   try {
//     const url = `${absUrl}/_api/Web/Lists/getByTitle('${libraryName}')/items(${itemId})/ValidateUpdateListItem`;
//     const headers = {
//       "Content-Type": "application/json;odata=verbose",
//       Accept: "application/json;odata=verbose",
//     };

//     const response = await client.post(url, SPHttpClient.configurations.v1, {
//       headers: headers,
//       body: JSON.stringify(metadata),
//     });

//     if (response.status !== 200) {
//       void displayjsx.showErrorMsg(
//         "Error while updating metadata for attachments. Attachments uploaded successfully. Error code:" +
//           response.status
//       );
//       return;
//     }

//     return;
//   } catch (error) {
//     void displayjsx.showErrorMsg(
//       "Unknown error while updateMetadataForAttachment"
//     );
//     console.error(error);
//     return;
//   }
// };

const uploadFile = async (
  file: File,
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  folderName: string,
  displaySuccessMsg: boolean = true
): Promise<boolean> => {
  const fileName = file.name;
  try {
    const url = `${absUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/folders('${folderName}')/Files/Add(url='${fileName}', overwrite=true)?$expand=ListItemAllFields`;
    const response = await client.post(url, SPHttpClient.configurations.v1, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;odata=verbose",
      },
      body: file,
    });

    if (response.status !== 200) {
      void displayjsx.showErrorMsg(
        `Error while uploading attachment ${fileName}. Error code: ${response.status}`
      );
      return false;
    } else {
      if (displaySuccessMsg)
        void displayjsx.showSuccess(
          `The file ${fileName} is uploaded successfully.`
        );
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const uploadAttachment = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  file: File,
  fileName: string,
  folderName: string,
  displaySuccessMsg: boolean = true
): Promise<boolean> => {
  try {
    // Checking if the folder already exists

    
    const checkFolderUrl = `${absUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Folders('${folderName}')`;
    
    const checkFolderResponse = await client.get(
      checkFolderUrl,
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
      const folderCreateUrl = `${absUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Folders/Add('${folderName}')`;
      await client
        .post(folderCreateUrl, SPHttpClient.configurations.v1, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;odata=verbose",
          },
        })
        .catch((err) => console.error(err));
    }
    
    // Adding the file inside the created folder
    
    const uploadResult = uploadFile(
      file,
      libraryName,
      absUrl,
      client,
      folderName,
      displaySuccessMsg
    );
    
    return uploadResult;

    // const json: IUploadICQAttachmentSPResponse = await response.json();
    // await updateMetadataForAttachment(
    //   libraryName,
    //   absUrl,
    //   client,
    //   json.ListItemAllFields.Id,
    //   {
    //     formValues: [
    //       {
    //         FieldName: "folderName",
    //         FieldValue: folderName,
    //       },
    //     ],
    //     bNewDocumentUpdate: true,
    //   }
    // );
  } catch (error) {
    console.error(error);
  }
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
        __metadata: { type: "SP.Data.TravelPolicyDocumentsItem" },
        Title: newFolderName,
        FileLeafRef: newFolderName,
      }),
    }
  );

  if (!renameResponse.ok) {
    console.error(`Error renaming folder: ${renameResponse.statusText}`);
  }

  console.log("Folder renamed successfully");
};

const checkIfFolderExists = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  folderName: string
): Promise<boolean> => {
  const endpoint = `${absUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}')`;

  try {
    const response = await client.get(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "odata-version": "3.0",
          // "Content-type": "application/json;odata=verbose",
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking folder existence:", error);
    return false;
  }
};

const createFolder = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  folderName: string
): Promise<void> => {
  const endpoint = `${absUrl}/_api/web/folders`;

  const body = JSON.stringify({
    __metadata: { type: "SP.Folder" },
    ServerRelativeUrl: `${libraryName}/${folderName}`,
  });

  try {
    const response = await client.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "odata-version": "3.0",
          "Content-Type": "application/json;odata=verbose",
        },
        body: body,
      }
    );

    if (response.ok) {
      console.log("Folder created successfully");
    } else {
      console.error("Error creating folder:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating folder:", error);
  }
};

const copyFile = async (
  absUrl: string,
  client: SPHttpClient,
  sourceFileUrl: string,
  destinationFileUrl: string
): Promise<void> => {
  const endpoint = `${absUrl}/_api/web/getfilebyserverrelativeurl('${sourceFileUrl}')/copyto(strnewurl='${destinationFileUrl}',boverwrite=true)`;

  try {
    const response = await client.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "odata-version": "3.0",
          "Content-Type": "application/json;odata=verbose",
        },
      }
    );

    if (response.ok) {
      console.log("File copied successfully:", destinationFileUrl);
    } else {
      console.error("Error copying file:", response.statusText);
    }
  } catch (error) {
    console.error("Error copying file:", error);
  }
};

const copyFiles = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  sourceFolder: string,
  destinationFolder: string
): Promise<void> => {
  const endpoint = `${absUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryName}/${sourceFolder}')/files`;

  try {
    const response = await client.get(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "odata-version": "3.0",
          // "Content-Type": "application/json;odata=verbose",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const files = data.d.results;

      for (const file of files) {
        const sourceFileUrl = file.ServerRelativeUrl;
        const fileName = sourceFileUrl.split("/").pop();
        const destinationFileUrl = `${libraryName}/${destinationFolder}/${fileName}`;

        await copyFile(absUrl, client, sourceFileUrl, destinationFileUrl);
      }
    } else {
      console.error("Error retrieving files:", response.statusText);
    }
  } catch (error) {
    console.error("Error retrieving files:", error);
  }
};

export const copyFilesFromSourceToDestination = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  sourceFolder: string,
  destinationFolder: string
): Promise<void> => {
  const folderExists = await checkIfFolderExists(
    libraryName,
    absUrl,
    client,
    destinationFolder
  );

  if (!folderExists) {
    await createFolder(libraryName, absUrl, client, destinationFolder);
  }

  await copyFiles(libraryName, absUrl, client, sourceFolder, destinationFolder);
};

export const deleteInvoiceAttachment = async (
  id: number
): Promise<IAPIResponse> => {
  try {
    const params = {
      params: {
        id: id,
      },
    };
    const response = await axios.post("/DeleteAttachment", null, params);
    console.log("DeleteAttachment res", response);
    const data: IAPIResponse = response.data;

    const handledData = handleAPISuccess(data);
    if (!handledData) return null;

    return data;
  } catch (error) {
    console.error("error", error);
    handleAPIError(error);
    return null;
  }
};

export const deleteFlightHotelAttachment = async (
  id: number
): Promise<IAPIResponse> => {
  try {
    const params = {
      params: {
        id: id,
      },
    };
    const response = await axios.post(
      "/DeleteFlightHotelInvoice",
      null,
      params
    );
    const data: IAPIResponse = response.data;

    const handledData = handleAPISuccess(data);
    if (!handledData) return null;

    return data;
  } catch (error) {
    console.error("error", error);
    handleAPIError(error);
    return null;
  }
};

const deleteFolder = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  folderName: string
): Promise<void> => {
  try {
    // Fetching the item ID of the folder
    const getFolderResponse = await client.get(
      `${absUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}')/ListItemAllFields`,
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

    // Delete the folder
    const deleteResponse = await client.post(
      `${absUrl}/_api/web/lists/getbytitle('${libraryName}')/items(${itemId})`,
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
      console.error(`Error deleting folder: ${deleteResponse.statusText}`);
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteFolderFile = async (
  libraryName: string,
  absUrl: string,
  client: SPHttpClient,
  folderName: string,
  fileName: string
): Promise<void> => {
  try {
    // Fetching the item ID of the file
    
    const url = `${absUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryName}/${folderName}/${fileName}')/ListItemAllFields`;
    const response = await client.post(url, SPHttpClient.configurations.v1, {
      headers: {
        Accept: "application/json;odata=verbose",
        "odata-version": "3.0",
        "Content-type": "application/json;odata=verbose",
      },
    });
    
    const fileData = await response.json();
    
    const itemId = fileData.d.Id;
    
    if (itemId) {
      // Delete the file
      const deleteResponse = await client.post(
        `${absUrl}/_api/web/lists/getbytitle('${libraryName}')/items(${itemId})`,
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
      }
      void displayjsx.showSuccess(
        `The file ${fileName} is deleted successfully.`
      );
      console.error(`Error deleting file: ${deleteResponse.statusText}`);
    } else console.error(`Error fetching the file`);
  } catch (error) {
    console.error(error);
    return;
  }
};

export default {
  uploadAttachment,
  deleteFolder,
  deleteInvoiceAttachment,
  deleteFlightHotelAttachment,
  renameFolder,
  copyFilesFromSourceToDestination,
  deleteFolderFile,
};
