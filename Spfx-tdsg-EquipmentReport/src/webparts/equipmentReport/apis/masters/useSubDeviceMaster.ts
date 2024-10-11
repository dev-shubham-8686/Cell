import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import {  GET_SUB_DEVICE_MASTER } from "../../URLs";



export interface ISubDeviceMaster {
    subDeviceId: number;
    deviceId:number;
    subDeviceName: string;
  }

  
const getSubDeviceMaster = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: ISubDeviceMaster[]}>(GET_SUB_DEVICE_MASTER);
  
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

const useSubDeviceMaster = () =>
    useQuery<ISubDeviceMaster[]>({
        queryKey: ["sub-device-master"],
        queryFn: () => getSubDeviceMaster(),
});

export default useSubDeviceMaster;
