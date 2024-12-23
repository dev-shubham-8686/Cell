import { useMutation } from "@tanstack/react-query";

import http from "../../../http";
import {
  ICustomAxiosConfig,
} from "../../../interface";
import {   GET_PULLBACK } from "../../../URLS";
import {  IPullBack } from "../../../components/common/workFlowButtons";

const pullBack = async (
    payload: IPullBack
) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
    params: {
        materialConsumptionId:payload.materialConsumptionId,
        userId:payload.userId,
        comment:payload.comment
    }
  };
  
  const response = await http.post<string>(
    GET_PULLBACK,  
   {},
    config
  );

  return response.data;
};

const usePullBack= (userId:number, materialConsumptionId:number) =>
  useMutation<string, null, IPullBack>({
    mutationKey: ["pull-back",{userId,materialConsumptionId}],
    mutationFn: pullBack,
    cacheTime:0
  });

export default usePullBack;
