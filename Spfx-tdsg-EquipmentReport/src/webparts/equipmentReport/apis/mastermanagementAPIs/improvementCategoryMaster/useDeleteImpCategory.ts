import { useMutation } from "@tanstack/react-query";
import http from "../../../http";
import { ICustomAxiosConfig } from "../../../interface";
import { MASTER_URL } from "../../../URLs";

export const deleteImpCategoryMaster = async (id: string) => {
  const config: ICustomAxiosConfig = {
      SHOW_NOTIFICATION: true,
    };
    const response = await http.delete(`${MASTER_URL}/DeleteImpCategoryMaster`, {
      params: { Id: id },
      ...config,

    });
    return response.data;
  };

  const useDeleteImpCategoryMaster = () =>
    useMutation<string, null,any>({
      mutationKey: ["delete-ImpCategory"],
      mutationFn: deleteImpCategoryMaster,
    });

    export default useDeleteImpCategoryMaster;

  