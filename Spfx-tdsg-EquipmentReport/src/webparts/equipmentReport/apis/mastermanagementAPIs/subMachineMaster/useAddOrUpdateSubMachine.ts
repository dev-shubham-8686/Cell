import http from "../../../http";
import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../../interface";
import { MASTER_URL } from "../../../URLs";

export const addOrUpdateSubMachineMaster = async (data: any) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
    const response = await http.post(
      `${MASTER_URL}/AddUpdateSubMachine`,
      data,
      {      ...config,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const useAddOrUpdateSubMachine = () =>
    useMutation<string, null, any>({
      mutationKey: ["add-update-submachine"],
      mutationFn: addOrUpdateSubMachineMaster,
    });
  
  export default useAddOrUpdateSubMachine;
  

