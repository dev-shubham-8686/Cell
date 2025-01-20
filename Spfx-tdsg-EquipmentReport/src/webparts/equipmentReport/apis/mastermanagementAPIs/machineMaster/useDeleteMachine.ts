import { useMutation } from "@tanstack/react-query";
import http from "../../../http";
import { ICustomAxiosConfig } from "../../../interface";

export const deleteMachineMaster = async (id: string) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
    const response = await http.delete(`/DeleteMachine`, {
      params: { Id: id },
      ...config,

    });
    return response.data;
  };

  const useDeleteMachineMaster = () =>
    useMutation<string, null,any>({
      mutationKey: ["delete-Machine"],
      mutationFn: deleteMachineMaster,
    });

    export default useDeleteMachineMaster;

  