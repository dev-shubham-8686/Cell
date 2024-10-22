import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_SECTION_HEAD_DETAILS } from "../../URLs";



export interface ISectionHead {
  sectionHeadId: number;
  head:number;
  headName:string;
  sectionName:string;
  }
  

const getSectionHeadDetails = async (departmentId:number) => {
 try{ 

  const response = await http.get<{ ReturnValue: ISectionHead[]}>(GET_SECTION_HEAD_DETAILS,{params:{
    departmentId
  }});
  
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

const useSectionHeadDetails = (departmentId:number) =>
    useQuery<ISectionHead[]>({
        queryKey: ["section-head-details"],
        queryFn: () => getSectionHeadDetails(departmentId),
});

export default useSectionHeadDetails;
