import { AxiosInstance as axios } from ".";

export interface DropDownOptionType {
  label: string;
  value: string | number;
  desc?: string;
}

export const GetUOMOptions = async (): Promise<Array<DropDownOptionType>> => {
  try {
    const response = await axios.get("/GetUOMOptions");

    const options: DropDownOptionType[] = [];

    if (response?.data?.length > 0) {
      response.data.forEach(
        (obj: { Id: string | number; OptionName: string }) => {
          options.push({
            label: obj.OptionName,
            value: obj.Id,
          });
        }
      );
    } else {
      console.log("Invalid Data type (not in array)");
    }

    return options;
  } catch (error) {
    console.error("error", error);
    return [];
  }
};

export const GetCategoryOptions = async (): Promise<
  Array<DropDownOptionType>
> => {
  try {
    const response = await axios.get("/GetCategoryOptions");

    const options: DropDownOptionType[] = [];

    if (response?.data?.length > 0) {
      response.data.forEach(
        (obj: { Id: string | number; OptionName: string }) => {
          options.push({
            label: obj.OptionName,
            value: obj.Id,
          });
        }
      );
    } else {
      console.log("Invalid Data type (not in array)");
    }

    return options;
  } catch (error) {
    console.error("error", error);
    return [];
  }
};

export const GetDepartmentOptions = async (): Promise<
  Array<DropDownOptionType>
> => {
  try {
    const response = await axios.get("/GetDepartmentOptions");

    const options: DropDownOptionType[] = [];

    if (response?.data?.length > 0) {
      response.data.forEach(
        (obj: { Id: string | number; OptionName: string }) => {
          options.push({
            label: obj.OptionName,
            value: obj.Id,
          });
        }
      );
    } else {
      console.log("Invalid Data type (not in array)");
    }

    return options;
  } catch (error) {
    console.error("error", error);
    return [];
  }
};

export const GetMaterialOptions = async (): Promise<
  Array<DropDownOptionType>
> => {
  try {
    const response = await axios.get("/GetMaterialOptions"); // Update endpoint accordingly

    const options: DropDownOptionType[] = [];

    if (response?.data?.length > 0) {
      response.data.forEach(
        (obj: { Id: string | number; OptionName: string }) => {
          options.push({
            label: obj.OptionName,
            value: obj.Id,
          });
        }
      );
    } else {
      console.log("Invalid Data type (not in array)");
    }

    return options;
  } catch (error) {
    console.error("error", error);
    return [];
  }
};

// export { GetCities, GetVendors, GetRequestTypes };
export default {
  GetUOMOptions,
  GetCategoryOptions,
  GetDepartmentOptions,
  GetMaterialOptions,
};
