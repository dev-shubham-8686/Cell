import http from "../../../http";
import { useQuery } from "@tanstack/react-query";
import { MASTER_URL } from "../../../URLs";

export const fetchSubMachineMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `${MASTER_URL}/GetSubMachineMaster`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetSubMachineMaster = () =>
    useQuery({
      queryKey: ["subMachineMaster"],
      queryFn: fetchSubMachineMaster,
    });