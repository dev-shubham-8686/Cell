import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_SECTION_MASTER } from "../../URLs";



export interface ISectionMaster {
    sectionId: number;
    sectionName: string;
  }
  

const getSectionMaster = async () => {
 try{ 

  const response = await http.get<{ ReturnValue: ISectionMaster[]}>(GET_SECTION_MASTER);
  
  if(response){
    const tabledata=response.data.ReturnValue?? []
    return tabledata;
  }
}
  catch (error) {
    console.error('Error fetching section master', error);
    return null;
  }
};

const useSectionMaster = () =>
    useQuery<ISectionMaster[]>({
        queryKey: ["section-master"],
        queryFn: () => getSectionMaster(),
});

export default useSectionMaster;
