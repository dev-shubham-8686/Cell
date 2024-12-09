// import { getAttachmentPath } from "../utility";
// import { IAttachmentPayload } from "./Attachment";

// export const Attachment_toPayload = (
//   attachmentData: any[],
//   folderName: string,
//   libraryType?: "adjustmentReport",
//   returnEmptyDocDetails: boolean = false
// ): IAttachmentPayload[] => {
//   let payloadData: IAttachmentPayload[] = [];

//   if (attachmentData && attachmentData?.length > 0) {
//     payloadData = attachmentData.map((attachment) => {
//       const obj = {
//         AdjustmentAttachmentId: attachment.attachmentId ?? 0,
//         documentName: attachment.name,
//         documentFilePath: getAttachmentPath(
//           folderName,
//           encodeURIComponent(attachment.name),
//           libraryType
//         ),
//       };

//       return obj;
//     });
//   }

//   if (returnEmptyDocDetails) {
//     payloadData = [
//       {
//         AdjustmentAttachmentId: 0,
//         documentName: "",
//         documentFilePath: "",
//       },
//     ];
//   }

//   return payloadData;
// };
