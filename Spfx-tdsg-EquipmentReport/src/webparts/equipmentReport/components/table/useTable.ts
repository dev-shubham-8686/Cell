import http from "../../http";
import { ObjectType } from "../../interface";
import { useMutation } from "@tanstack/react-query";


interface IGridParams {
  createdBy?: number;
  url?: string;
  params?: ObjectType;
  listingScreen?:boolean;
}

export enum MessageType {
  Create = 1,
  Approved = 2,
  SessionTimeOut = 3,
  Close = 4,
  Received = 5,
  Error = 6,
  Success = 7,
  PartialSuccess = 8
}


export const sessionExpiredStatus = [
  MessageType.SessionTimeOut,
  MessageType.Error,
];


const getGridData = async (param: IGridParams ) => {
 try{ if (!param.url) return;

  const response = await http.get<any[] | any>(param.url, {
    params: { ...param.params },
  });
  
  if(param.listingScreen){
    const tabledata=response.data.ReturnValue?JSON.parse(response.data?.ReturnValue): []
    return tabledata;
  }
  else {
    return response.data.ReturnValue;
  }}
  catch (error) {
    console.error('Error fetching trouble report listing:', error);
   // handleAPIError(error);
    return null;
  }
};

const useGrid = () =>
  useMutation<any[]  | undefined, null, IGridParams>({
    mutationKey: ["grid"],
    mutationFn: getGridData,
    networkMode: "always",
    cacheTime: 0,
  });

export default useGrid;
