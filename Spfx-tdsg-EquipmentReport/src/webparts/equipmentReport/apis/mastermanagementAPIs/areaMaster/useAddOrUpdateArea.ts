import http from "../../../http";
import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../../interface";
import { MASTER_URL } from "../../../URLs";

export const addOrUpdateAreaMaster = async (data: any) => {
  const config: ICustomAxiosConfig = {
          SHOW_NOTIFICATION: true,
        };
    const response = await http.post(
      `${MASTER_URL}/AddUpdateArea`,
      data,
      {
        ...config,
        headers: {
          "Content-Type": "application/json",
        },
        
      }
      
    );
    return response.data;
  };

  const useAddOrUpdateArea = () =>
    useMutation<string, null, any>({
      mutationKey: ["add-update-Area"],
      mutationFn: addOrUpdateAreaMaster,
    });
  
  export default useAddOrUpdateArea;
  

