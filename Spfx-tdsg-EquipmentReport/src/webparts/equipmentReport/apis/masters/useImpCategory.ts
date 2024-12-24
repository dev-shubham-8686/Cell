import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import {  GET_IMP_CATEGORY, GET_SUB_MACHINE_MASTER } from "../../URLs";



export interface IImpCategory {
    ImpCategoryId:number;
    ImpCategoryName: string;
  }

  
const getImpCategoryMaster = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: IImpCategory[]}>(GET_IMP_CATEGORY);
  
  if(response){
    const tabledata=response.data.ReturnValue?? []
    return tabledata;
  }
 }
  catch (error) {
    console.error('Error fetching sub device master', error);
    return null;
  }
};

const useImpCategoryMaster = () =>
    useQuery<IImpCategory[]>({
        queryKey: ["improvement-category-master"],
        queryFn: () => getImpCategoryMaster(),
});

export default useImpCategoryMaster;
