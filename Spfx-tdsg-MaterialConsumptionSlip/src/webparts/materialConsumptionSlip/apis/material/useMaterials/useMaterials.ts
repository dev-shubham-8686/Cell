import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_MATERIALS } from "../../../URLS";

interface IMaterial {
  materialId: number;
  code: string;
  description: string;
  uom: number;
  category: number;
  costCenter: number;
}

const getMaterials = async () => {
  const response = await http.get<{ ReturnValue: IMaterial[] }>(GET_MATERIALS);
  return response.data.ReturnValue;
};

const useMaterials = () =>
  useQuery<IMaterial[]>({
    queryKey: ["materials"],
    queryFn: getMaterials,
  });

export default useMaterials;
