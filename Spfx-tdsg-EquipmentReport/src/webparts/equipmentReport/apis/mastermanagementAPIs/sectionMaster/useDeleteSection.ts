import { useMutation } from "@tanstack/react-query";
import http from "../../../http";
import { ICustomAxiosConfig } from "../../../interface";
import { MASTER_URL } from "../../../URLs";

export const deleteSectionMaster = async (id: string) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
    const response = await http.delete(`${MASTER_URL}/DeleteSection`, {
      params: { Id: id },
      ...config,

    });
    return response.data;
  };
  

  const useDeleteSectionMaster = () =>
    useMutation<string, null,any>({
      mutationKey: ["delete-Section"],
      mutationFn: deleteSectionMaster,
    });

    export default useDeleteSectionMaster;

  