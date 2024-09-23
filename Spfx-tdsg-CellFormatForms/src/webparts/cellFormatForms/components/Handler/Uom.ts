// local imports
import { handleAPIError, handleAPISuccess } from "./index";
import axios from "axios";
import { Message, ServiceUrl } from "../GLOBAL_CONSTANT"
// import { IAPIResponse } from "./interface";
import { message } from "antd";

export type IUOM = {
    UOMId: number;
    UOMName: string;
    IsActive: boolean;
    CreatedBy: number;
    ModifiedBy: number;

};
export type IUOMParam = Pick<IUOM,
    "UOMId"
|"UOMName"
|"IsActive"
|"CreatedBy"
|"ModifiedBy"
>;
const DeleteUOM = async (UOMId: number) => {
    try {

        const response = await axios.post(`${ServiceUrl + "/DeleteFlighType?Id=" + UOMId}`, {
            headers: {
                Authorization: 'Bearer',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        const data = response.data;
        const handledData = handleAPISuccess(data);

        if (!handledData) return null;

        return data;
    } catch (error) {
        handleAPIError(error);
        return null;
    }
};

const GetUOMDetails = async (): Promise<
    IUOM[]
> => {

    try {

        const response = await axios.get(ServiceUrl + "/GetFlighType");
        const data: IUOM[] = response.data;


        console.log(data)
        return data;
    } catch (error) {
        handleAPIError(error);
        return [];
    }
};

const getUOMById = async (
    getEmpID: number
): Promise<IUOM> => {
    try {
         
        const response = await axios.get(
            ServiceUrl + "/GetFlighTypeMasterById?ID=" + getEmpID
        );
        const data: IUOM = response.data;

        return data;
    } catch (error) {

        handleAPIError(error);
        return error;
    }
};

const AddUOM = async (UOM: IUOM) => {
    try {

        UOM.IsActive = UOM.IsActive == false ? false : true;

        const response = await axios.post(ServiceUrl + "/PostInsertFlighType", UOM);
        const data = response.data;
        const handledData = handleAPISuccess(data);

        if (!handledData) return null;
        console.log(data)
        return data;
    } catch (error) {

        handleAPIError(error);
        return null;
    }
};

const EditUOM = async (UOM: IUOM) => {
    try {
        UOM.IsActive = UOM.IsActive == false ? false : true;
        const response = await axios.post(ServiceUrl + "/PostUpdateFlighType", UOM);
        const data = response.data;
        const handledData = handleAPISuccess(data);

        if (!handledData) return null;

        return data;
    } catch (error) {
        handleAPIError(error);
        return null;
    }
};


export {
    DeleteUOM,
    GetUOMDetails,
    getUOMById,
    AddUOM,
    EditUOM
};

export default {
    DeleteUOM,
    GetUOMDetails,
    getUOMById,
    AddUOM,
    EditUOM
};
