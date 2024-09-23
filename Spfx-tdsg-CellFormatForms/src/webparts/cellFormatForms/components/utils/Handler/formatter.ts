import { spWebUrl } from "../../GLOBAL_CONSTANT";
import { IAPIAttachmentData } from "../attachment";
import { getAttachmentPath } from "../utility";
import { IAttachmentPayload } from "./Attachment";



export const Attachment_toPayload = (
    attachmentData: any[],
    folderName: string,
    libraryType?: "troubleReport" ,
    returnEmptyDocDetails: boolean = false
  ): IAttachmentPayload[] => {
    let payloadData: IAttachmentPayload[] = [];
     
    if (attachmentData && attachmentData?.length > 0) {
        
      payloadData = attachmentData.map((attachment) => {
        const obj = {
          TroubleAttachmentId:attachment.attachmentId??0,
          documentName: attachment.name,
          documentFilePath: getAttachmentPath(
            folderName,
            encodeURIComponent(attachment.name),
            libraryType
          ),
        };
        
        return obj;
        
      });
    }
  
    if (returnEmptyDocDetails) {
      payloadData = [
        {
          TroubleAttachmentId:0,
          documentName: null,
          documentFilePath: null,
        },
      ];
    }
  
    return payloadData;
  };


  
  export const Payload_toAttachment = (
    response: IAPIAttachmentData[]
  ): IAPIAttachmentData[] => {
    
    let data: IAPIAttachmentData[] = [];
    
    if (response && response?.length > 0) {
      
      data = response?.map((attch) => {
        
        return {
          ...attch,
          url: `${spWebUrl}${attch.url}`,
        };
      });
    }
  
    return data;
  };

  export const Payload_toTroubleReport = (
    response:any
  ) => {
    let data;
    if (response) {
      
      data = {
        ...response,
        TroubleAttachmentDetails: Payload_toAttachment(
          (response?.TroubleAttachmentDetails as IAPIAttachmentData[]) ?? []
        ),
      };
    }
    return data;
  };

  export default {
    Payload_toTroubleReport,
    Attachment_toPayload,
    Payload_toAttachment 
  };
  