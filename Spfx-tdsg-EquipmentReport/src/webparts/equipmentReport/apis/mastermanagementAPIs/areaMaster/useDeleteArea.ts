import { useMutation } from "@tanstack/react-query";
import http from "../../../http";
import { ICustomAxiosConfig } from "../../../interface";
import { MASTER_URL } from "../../../URLs";

export const deleteAreaMaster = async (id: string) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
    const response = await http.delete(`${MASTER_URL}/DeleteArea`, {
      params: { areaId: id },
      ...config,

    });
    return response.data;
  };

  const useDeleteAreaMaster = () =>
    useMutation<string, null,any>({
      mutationKey: ["delete-Area"],
      mutationFn: deleteAreaMaster,
    });

    export default useDeleteAreaMaster;

  