import { useMutation } from "@tanstack/react-query";
import http from "../../../http";
import { ICustomAxiosConfig } from "../../../interface";

export const deleteSubMachineMaster = async (id: string) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
    const response = await http.delete(`/DeleteSubMachine`, {
      params: { Id: id },
      ...config,

    });
    return response.data;
  };

  const useDeleteSubMachineMaster = () =>
    useMutation<string, null,any>({
      mutationKey: ["delete-SubMachine"],
      mutationFn: deleteSubMachineMaster,
    });

    export default useDeleteSubMachineMaster;

  