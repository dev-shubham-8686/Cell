import { useQuery } from "@tanstack/react-query";
import { IEmailAttachments } from "../../../components/common/TextBoxModal";
import http from "../../../http";
import { GET_EMAIL_ATTACHMENTS } from "../../../URLs";

// export interface IEmailAttachment{
//   emailAttachments:IEmailAttachments[];
// }
const getEmailAttachmentData = async (id?: number) => {
  if (!id) return undefined;

  const response = await http.get<{
    ReturnValue: IEmailAttachments[];
  }>(GET_EMAIL_ATTACHMENTS, { params: {id: id } });
  console.log("Email Attahcments Data RESPONSE",response)
  
  return response?.data?.ReturnValue;
  
};

const useGetEmailAttachmentsData = (id?: number) =>
  useQuery<IEmailAttachments[] | undefined>({
    queryKey: ["get-email-attachment", id],
    queryFn: () => getEmailAttachmentData(id),
    cacheTime: 0,
  });

export default useGetEmailAttachmentsData;
