import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_COST_CENTERS } from "../../../URLS";

export interface ICostCenter {
  costCenterId: number;
  name: string;
}

const getCostCenters = async () => {
  const response = await http.get<{ ReturnValue: ICostCenter[] }>(
    GET_COST_CENTERS
  );
  return response.data.ReturnValue;
};

const useCostCenters = () =>
  useQuery<ICostCenter[]>({
    queryKey: ["cost-centers"],
    queryFn: getCostCenters,
  });

export default useCostCenters;
