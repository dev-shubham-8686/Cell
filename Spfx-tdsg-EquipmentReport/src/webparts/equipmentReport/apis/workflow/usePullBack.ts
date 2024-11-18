import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../interface";
import { GET_PULLBACK } from "../../URLs";
import http from "../../http";


export interface IPullBack {
    equipmentId: number;
    userId: number;
    comment: string;
  }
const pullBack = async (
    payload: IPullBack
) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
  
  const response = await http.post<string>(
    GET_PULLBACK,  
   payload,
    config
  );

  return response.data;
};

const usePullBack= (userId:number, equipmentId:number) =>
  useMutation<string, null, IPullBack>({
    mutationKey: ["pull-back",{userId,equipmentId}],
    mutationFn: pullBack,
    cacheTime:0
  });

export default usePullBack;
