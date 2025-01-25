import http from "../../../http";
import { useQuery } from "@tanstack/react-query";

export const fetchMachineMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `MasterTbl/GetMachineMaster`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetMachineMaster = () =>
    useQuery({
      queryKey: ["MachineMaster"],
      queryFn: fetchMachineMaster,
    });