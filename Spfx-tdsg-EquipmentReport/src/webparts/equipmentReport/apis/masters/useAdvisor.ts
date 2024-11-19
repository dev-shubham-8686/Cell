import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_ADVISOR_MASTER } from "../../URLs";



export interface IAdvisorDetail {
    employeeId: number;
    employeeName:string;
  }
  

const getAdvisorDetails = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: IAdvisorDetail[]}>(GET_ADVISOR_MASTER);
  
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

const useAdvisorDetails = () =>
    useQuery<IAdvisorDetail[]>({
        queryKey: ["advisor-details"],
        queryFn: () => getAdvisorDetails(),
});

export default useAdvisorDetails;
