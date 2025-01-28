import http from "../../../http";
import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../../interface";

export const addOrUpdateSectionMaster = async (data: any) => {
  
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
    const response = await http.post(
      `/AddUpdateSection`,
      data,
      {      ...config,

        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const useAddOrUpdateSection = () =>
    useMutation<string, null, any>({
      mutationKey: ["add-update-Section"],
      mutationFn: addOrUpdateSectionMaster,
    });
  
  export default useAddOrUpdateSection;
  

