import http from "../../../http";
import { useMutation } from "@tanstack/react-query";
import { ICustomAxiosConfig } from "../../../interface";

export const addOrUpdateImpCategoryMaster = async (data: any) => {
    const config: ICustomAxiosConfig = {
          SHOW_NOTIFICATION: true,
        };
    const response = await http.post(
      `/AddUpdateImpCategory`,
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

  const useAddOrUpdateImpCategory = () =>
    useMutation<string, null, any>({
      mutationKey: ["add-update-ImpCategory"],
      mutationFn: addOrUpdateImpCategoryMaster,
    });
  
  export default useAddOrUpdateImpCategory;
  

