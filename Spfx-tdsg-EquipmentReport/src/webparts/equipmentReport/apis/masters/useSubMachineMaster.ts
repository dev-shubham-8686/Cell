import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import {  GET_SUB_MACHINE_MASTER } from "../../URLs";



export interface ISubMachineMaster {
  SubMachineId: number;
    MachineId:number;
    SubMachineName: string;
  }

  
const getSubMachineMaster = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: ISubMachineMaster[]}>(GET_SUB_MACHINE_MASTER);
  
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

const useSubMachineMaster = () =>
    useQuery<ISubMachineMaster[]>({
        queryKey: ["sub-device-master"],
        queryFn: () => getSubMachineMaster(),
});

export default useSubMachineMaster;
