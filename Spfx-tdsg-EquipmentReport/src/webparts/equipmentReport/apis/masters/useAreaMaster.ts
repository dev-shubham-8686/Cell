import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_AREA_MASTER } from "../../URLs";

export interface IAreaMaster {
    AreaId: number;
    AreaName: string;
}

const getAreaMaster = async () => {
  try {
    const response = await http.get<{ReturnValue: IAreaMaster[]}>(GET_AREA_MASTER);
     
    if (response) {
      
      const tabledata = response.data.ReturnValue ?? [];
      return tabledata;
    }
  } catch (error) {
    console.error("Error fetching Area master", error);
    return null;
  }
};

const useAreaMaster = () =>
  useQuery<IAreaMaster[]>({
    queryKey: ["area-master"],
    queryFn: () => getAreaMaster(),
  });

export default useAreaMaster;
