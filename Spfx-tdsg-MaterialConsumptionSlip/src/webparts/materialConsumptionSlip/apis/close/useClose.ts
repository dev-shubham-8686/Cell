import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../interface";
import http from "../../http";
import { CLOSE_REQUEST } from "../../URLS";

export interface ICloseRequestPayload {
  MaterialConsumptionId: number;
  isScraped: boolean;
  scrapTicketNo: string;
  scrapRemarks: string;
  userId: number;
}

const CloseRequest = async (payload: ICloseRequestPayload) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };

  const response = await http.post<string>(CLOSE_REQUEST, payload, config);

  return response.data;
};

const useClose = () =>
  useMutation<string, null, ICloseRequestPayload>({
    mutationKey: ["close-request"],
    mutationFn: CloseRequest,
    cacheTime: 0,
  });

export default useClose;
