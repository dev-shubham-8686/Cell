import http from "../../../http";
import { useQuery } from "@tanstack/react-query";

export const fetchSubMachineMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `/GetAllSubMachines`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetSubMachineMaster = () =>
    useQuery({
      queryKey: ["subMachineMaster"],
      queryFn: fetchSubMachineMaster,
    });