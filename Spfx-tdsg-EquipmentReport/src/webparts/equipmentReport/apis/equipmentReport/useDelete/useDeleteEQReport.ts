import { useMutation } from "@tanstack/react-query";

import { showSuccess } from "../../../utility/displayjsx";
import http from "../../../http";
import { DELETE_EQ_REPORT } from "../../../URLs";

const deleteequipment = async (id: number) => {
 
  
  const response = await http.delete<any>(DELETE_EQ_REPORT,{ params: {Id: id } });
  
  if(response){void showSuccess(response.data.Message)}
  
  const data = response.data.ReturnValue;
  
  
  return response.data;
};

const useDeleteEQReport = () =>
  useMutation<string, null,number>({
    mutationKey: ["delete-equipment"],
    mutationFn: deleteequipment,
  });

export default useDeleteEQReport;
