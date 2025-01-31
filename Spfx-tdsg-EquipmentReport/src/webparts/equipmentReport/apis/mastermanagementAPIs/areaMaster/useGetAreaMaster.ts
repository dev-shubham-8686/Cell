import http from "../../../http";
import { useQuery } from "@tanstack/react-query";
import { MASTER_URL } from "../../../URLs";

export const fetchAreaMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `${MASTER_URL}/GetAreaMaster`
    );
    return response.data.ReturnValue ?? [];
  };
  
   const useGetAreaMaster = () =>
    useQuery({
      queryKey: ["areaMaster"],
      queryFn: fetchAreaMaster,
    });

    export default useGetAreaMaster