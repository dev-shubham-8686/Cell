import http from "../../../http";
import { useQuery } from "@tanstack/react-query";

export const fetchSectionMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `/GetAllSection`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetSectionMaster = () =>
    useQuery({
      queryKey: ["sectionMaster"],
      queryFn: fetchSectionMaster,
    });