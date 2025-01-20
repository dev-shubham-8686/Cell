import http from "../../../http";
import { useQuery } from "@tanstack/react-query";

export const fetchImpCategoryMaster = async () => {
    const response = await http.get<{ ReturnValue: any[] }>(
      `/GetAllImprovementCategories`
    );
    return response.data.ReturnValue ?? [];
  };
  
  export const useGetImpCategoryMaster = () =>
    useQuery({
      queryKey: ["impCategoryMaster"],
      queryFn: fetchImpCategoryMaster,
    });