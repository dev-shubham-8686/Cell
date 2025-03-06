import http from "../../../http";
import { useQuery } from "@tanstack/react-query";
import { MASTER_URL } from "../../../URLs";

export const fetchSectionMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `${MASTER_URL}/GetSectionMaster`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetSectionMaster = () =>
    useQuery({
      queryKey: ["sectionMaster"],
      queryFn: fetchSectionMaster,
    });