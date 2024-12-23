import { useMutation } from "@tanstack/react-query";

import http from "../../../http";
import {
  ICustomAxiosConfig,
  IMaterialConsumptionSlipForm,
} from "../../../interface";
import { CREATE_EDIT_MATERIAL_CONSUMPTION_SLIP } from "../../../URLS";

const createMaterialConsumptionSlip = async (
  materialConsumptionSlip: IMaterialConsumptionSlipForm
) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };
debugger
  const response = await http.post<string>(
    CREATE_EDIT_MATERIAL_CONSUMPTION_SLIP,
    materialConsumptionSlip,
    config
  );
  debugger
  return response.data;
};

const useCreateEditMaterialConsumptionSlip = () =>
  useMutation<string, null, IMaterialConsumptionSlipForm>({
    mutationKey: ["create-material-consumption-slip"],
    mutationFn: createMaterialConsumptionSlip,
  });

export default useCreateEditMaterialConsumptionSlip;
