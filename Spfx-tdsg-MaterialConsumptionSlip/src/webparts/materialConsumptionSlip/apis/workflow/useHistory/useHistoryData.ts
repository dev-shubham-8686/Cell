import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import {  GET_HISTORY_DATA,  } from "../../../URLS";
import { IMaterialConsumptionSlipForm } from "../../../interface";

export interface IHistoryDetail {
  historyId: number;
  action: string;
  comments: string;
  //status: string;
  actionTakenBy: number;
  actionTakenDate: string; //12-24-2024 12:12:12
 // role: string;
}

const getHistoryData = async (id?: number) => {
  if (!id) return undefined;

  
  const response = await http.get<{
    ReturnValue: IHistoryDetail;
  }>(GET_HISTORY_DATA, { params: {materialConsumptionId: id } });
  return response.data.ReturnValue;
};

const useHistoryData = (id?: number) =>
  useQuery<IHistoryDetail | undefined>({
    queryKey: ["get-history-data", id],
    queryFn: () => getHistoryData(id),
    cacheTime: 0,
  });

export default useHistoryData;
