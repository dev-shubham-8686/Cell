import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import {  GET_FUNCTION_MASTER } from "../../URLs";


export interface IFunctionMaster {
    functionId: number;
    functionName: string;
  }

  
const getFunctionMaster = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: IFunctionMaster[]}>(GET_FUNCTION_MASTER);
  
  if(response){
    const tabledata=response.data.ReturnValue?? []
    return tabledata;
  }
 }
  catch (error) {
    console.error('Error fetching function master:', error);
    return null;
  }
};

const useFunctionMaster = () =>
    useQuery<IFunctionMaster[]>({
        queryKey: ["function-master"],
        queryFn: () => getFunctionMaster(),
});

export default useFunctionMaster;
