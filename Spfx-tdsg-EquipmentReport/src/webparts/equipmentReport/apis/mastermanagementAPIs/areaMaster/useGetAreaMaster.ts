import http from "../../../http";
import { useQuery } from "@tanstack/react-query";

export const fetchAreaMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `/GetAllAreas`
    );
    return response.data.ReturnValue ?? [];
  };
  
   const useGetAreaMaster = () =>
    useQuery({
      queryKey: ["areaMaster"],
      queryFn: fetchAreaMaster,
    });

    export default useGetAreaMaster