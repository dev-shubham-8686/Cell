import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_SECTION_HEAD_DETAILS } from "../../URLs";



export interface ISectionHead {
    SectionHeadId: number;
    SectionHeadName: string;
  }
  

const getSectionHeadDetails = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: ISectionHead[]}>(GET_SECTION_HEAD_DETAILS);
  
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

const useSectionHeadDetails = () =>
    useQuery<ISectionHead[]>({
        queryKey: ["section-head-details"],
        queryFn: () => getSectionHeadDetails(),
});

export default useSectionHeadDetails;
