import http from "../../../http";
import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../../interface";

export const addOrUpdateMachineMaster = async (data: any) => {
   const config: ICustomAxiosConfig = {
            SHOW_NOTIFICATION: true,
          };
    const response = await http.post(
      `/AddUpdateMachine`,
      data,
      {      ...config,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const useAddOrUpdateMachine = () =>
    useMutation<string, null, any>({
      mutationKey: ["add-update-machine"],
      mutationFn: addOrUpdateMachineMaster,
    });
  
  export default useAddOrUpdateMachine;
  

