import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_RESULT_MONITOR_DETAILS } from "../../URLs";



export interface IResultMonitor {
    resultMonitorId: number;
  resultMonitorName:string;
  }
  

const getResultMonitorDetails = async () => {
 try{ 
    
  const response = await http.get<{ ReturnValue: IResultMonitor[]}>(GET_RESULT_MONITOR_DETAILS);
  
  if(response){
    const tabledata=response.data.ReturnValue?? []
    return tabledata;
  }
  
}
  catch (error) {
    console.error('Error fetching section head Details', error);
    return null;
  }
};

const useResultMonitorDetails = () =>
    useQuery<IResultMonitor[]>({
        queryKey: ["result-monitoring-details"],
        queryFn: () => getResultMonitorDetails(),
});

export default useResultMonitorDetails;
