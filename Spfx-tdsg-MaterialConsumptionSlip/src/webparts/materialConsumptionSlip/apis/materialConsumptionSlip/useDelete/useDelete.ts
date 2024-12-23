import { useMutation } from "@tanstack/react-query";

import http from "../../../http";
import { DELETE_MATERIAL_CONSUMPTION_SLIP } from "../../../URLS";
import { showSuccess } from "../../../utility/displayjsx";

const deleteMaterialConsumptionSlip = async (id: number) => {
 
  
  const response = await http.delete<any>(DELETE_MATERIAL_CONSUMPTION_SLIP,{ params: {Id: id } });
  
  if(response){void showSuccess(response.data.Message)}
  
  const data = response.data.ReturnValue;
  
  
  return response.data;
};

const useDeleteMaterialConsumptionSlip = () =>
  useMutation<string, null,number>({
    mutationKey: ["delete-material-consumption-slip"],
    mutationFn: deleteMaterialConsumptionSlip,
  });

export default useDeleteMaterialConsumptionSlip;
