import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_CATEGORIES } from "../../../URLS";

interface ICategory {
  categoryId: number;
  name: string;
}

const getCategories = async () => {
  const response = await http.get<{ ReturnValue: ICategory[] }>(GET_CATEGORIES);
  return response.data.ReturnValue;
};

const useCategories = () =>
  useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

export default useCategories;
