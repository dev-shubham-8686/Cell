import { useMutation } from "@tanstack/react-query";
import http from "../../http";
import { ICustomAxiosConfig } from "../../interface";
import { DELEGATE_USER } from "../../URLS";

export interface IDelegate {
    FormId?: number;
    UserId?: number;          // who is performing action    -- admin id 
    DelegateUserId?:number ;  // the person who is new delegate   
    activeUserId?:number      // current user          
    ApproverTaskId?:number ;
    Comments?: string;
}


 const delegate = async (
    payload: IDelegate
): Promise<any> => {
    const config: ICustomAxiosConfig = {
        SHOW_NOTIFICATION: true,
      };
    console.log(JSON.stringify(payload))
    const response = await http.post<boolean>(DELEGATE_USER, payload,config);
    return response.data;
};

const useDelegate = () =>
  useMutation<string, null,IDelegate>({
    mutationKey: ["delegate-user"],
    mutationFn: delegate, 
  });

  export default useDelegate;
