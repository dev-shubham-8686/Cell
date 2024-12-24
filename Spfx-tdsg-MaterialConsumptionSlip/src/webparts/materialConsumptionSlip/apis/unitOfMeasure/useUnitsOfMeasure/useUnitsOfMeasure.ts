import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_UNITS_OF_MEASURE } from "../../../URLS";

interface IUnitOfMeasure {
  uomid: number;
  name: string;
}

const getUnitsOfMeasure = async () => {
  const response = await http.get<{ ReturnValue: IUnitOfMeasure[] }>(
    GET_UNITS_OF_MEASURE
  );
  return response.data.ReturnValue;
};

const useUnitsOfMeasure = () =>
  useQuery<IUnitOfMeasure[]>({
    queryKey: ["unit-of-measure"],
    queryFn: getUnitsOfMeasure,
  });

export default useUnitsOfMeasure;
