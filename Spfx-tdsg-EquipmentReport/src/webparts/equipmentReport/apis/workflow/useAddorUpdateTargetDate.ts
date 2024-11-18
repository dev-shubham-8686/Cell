import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../interface";
import { CREATE_EDIT_TARGET_DATE } from "../../URLs";
import http from "../../http";
import { ITargetData } from "./useApproveAskToAmmend";



const createEditTargetDate = async (payload: ITargetData) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };

  const response = await http.post<string>(
    CREATE_EDIT_TARGET_DATE,
    payload,
    config
  );

  return response.data;
};

const useAddOrUpdateTargetDate = () =>
  useMutation<string, null,ITargetData>({
    mutationKey: ["create-eq-report"],
    mutationFn: createEditTargetDate,
  });

export default useAddOrUpdateTargetDate;
