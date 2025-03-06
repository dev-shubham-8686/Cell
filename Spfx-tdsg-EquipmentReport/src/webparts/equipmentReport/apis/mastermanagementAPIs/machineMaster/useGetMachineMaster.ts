import http from "../../../http";
import { useQuery } from "@tanstack/react-query";
import { MASTER_URL } from "../../../URLs";

export const fetchMachineMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `${MASTER_URL}/GetMachineMaster`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetMachineMaster = () =>
    useQuery({
      queryKey: ["MachineMaster"],
      queryFn: fetchMachineMaster,
    });