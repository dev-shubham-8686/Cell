import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_MATERIAL_CONSUMPTION_SLIP } from "../../../URLS";
import { IMaterialConsumptionSlipForm } from "../../../interface";

const getMaterialConsumptionSlip = async (id?: number) => {
  if (!id) return undefined;

  const response = await http.get<{
    ReturnValue: IMaterialConsumptionSlipForm;
  }>(GET_MATERIAL_CONSUMPTION_SLIP, { params: { id } });
  return response.data.ReturnValue;
};

const useMaterialConsumptionSlip = (id?: number, onError?: (error: any) => void) =>
  useQuery<IMaterialConsumptionSlipForm | undefined>({
    queryKey: ["get-material-consumption-slip", id],
    queryFn: () => getMaterialConsumptionSlip(id),
    cacheTime: 0,
    onError,
  });

export default useMaterialConsumptionSlip;
