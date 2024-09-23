import { DropDownOptionType } from "../../components/utils/Handler/Dropdown";

export const ActionTypes = {
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_IS_ADMIN: "SET_IS_ADMIN",
  SET_USER_ROLE: "SET_USER_ROLE",
  SET_USER: "SET_USER",
  IS_VISIBLE_DRAFT: "IS_VISIBLE_DRAFT",
  SET_TEMP_REF_NUMBER: "SET_TEMP_REF_NUMBER",

  SET_ACTIVE_FORM_SECTION: "SET_ACTIVE_FORM_SECTION",
  SET_CITY_DROPDOWN_OPTIONS: "SET_CITY_DROPDOWN_OPTIONS",
  SET_EMPLOYEE_NAMES_DROPDOWN_OPTIONS: "SET_VENDOR_DROPDOWN_OPTIONS",
  SET_FORM_SECTION_STATUS: "SET_FORM_SECTION_STATUS",
};

export interface IAction {
  type: string;
  payload?: any;
}

export type IUserRole = {
  isAdmin: boolean;
  employeeId: number;
  EmployeeName: string;
  Email: string;
  Mobile: string;
  Designation: string;
  DepartmentId: number;
  DepartmentName: string;
  departmentHeadEmpId: number;
  DivisionId: number;
  DivisionName: string;
  CostCenter: string;
  // NewCF: boolean;
  // EditCF: boolean;
  // CopyCF: boolean;
  // DepartmentHeadID: number;
  // IsVehiclePortalUser: boolean;
  // IsRequestorUser: boolean;
  // IsLogisticUser: boolean;
};

export type IAuthUser = {
  NewId: number;
  RecordNumber: string;
  ResultType: number;
  Message: string;
};

export type sectionStatus = "submitted" | "pending";

export type IFormDetails = {
  cityDropdownOptions: DropDownOptionType[];
  employeeNamesDropdownOptions: DropDownOptionType[];
  formSectionStatus: sectionStatus[];
};

export interface IState {
  isLoading: boolean;
  isAdmin: boolean;
  isDelegate: boolean;
  userRole: IUserRole;
  authUser: IAuthUser;
  isVisibleDraftButton: string;

  tempRefNumber: string;
  formDetails: IFormDetails;
  activeFormSection: number;
}

const initialState: IState = {
  isLoading: false,
  isAdmin: false,
  isDelegate: false,
  userRole: {
    isAdmin: false,
    employeeId: 0,
    EmployeeName: null,
    Email: null,
    Mobile: null,
    Designation: null,
    DepartmentId: 0,
    DepartmentName: null,
    departmentHeadEmpId: null,
    DivisionId: 0,
    DivisionName: null,
    CostCenter: null,
    // NewCF: false,
    // EditCF: false,
    // CopyCF: false,
    // DepartmentHeadID: 0,
    // IsVehiclePortalUser: false,
    // IsRequestorUser: false,
    // IsLogisticUser: false,
  },
  authUser: {
    NewId: 0,
    RecordNumber: null,
    ResultType: 0,
    Message: null,
  },
  isVisibleDraftButton: "",

  tempRefNumber: "",
  activeFormSection: 0,
  formDetails: {
    cityDropdownOptions: null,
    employeeNamesDropdownOptions: null,
    formSectionStatus: [
      "pending",
      "pending",
      "pending",
      "pending",
      "pending",
      "pending",
      "pending",
    ],
    // formSectionDetails: {
    //   empDetails: undefined,
    //   travelDetails: undefined,
    //   flightDetails: undefined,
    //   hotelDetails: undefined,
    //   carDetails: undefined,
    //   invoiceDetails: undefined,
    //   officeUseDetails: undefined,
    // },
  },
};

export default function commonReducer(state = initialState, action: IAction) {
  let newState = (<any>Object).assign({}, state) as IState;
  switch (action.type) {
    case ActionTypes.SET_IS_LOADING: {
      newState.isLoading = action.payload;
      return newState;
    }
    case ActionTypes.IS_VISIBLE_DRAFT: {
      newState.isVisibleDraftButton = action.payload;
      return newState;
    }
    case ActionTypes.SET_IS_ADMIN: {
      newState.isAdmin = action.payload;
      return newState;
    }
    case ActionTypes.SET_USER_ROLE: {
      newState.userRole = action.payload;

      return newState;
    }
    case ActionTypes.SET_USER: {
      newState.authUser = action.payload;
      return newState;
    }

    case ActionTypes.SET_TEMP_REF_NUMBER: {
      newState.tempRefNumber = action.payload;
      return newState;
    }

    case ActionTypes.SET_ACTIVE_FORM_SECTION: {
      newState.activeFormSection = action.payload;
      return newState;
    }
    case ActionTypes.SET_FORM_SECTION_STATUS: {
      newState.formDetails.formSectionStatus = action.payload;
      return newState;
    }
    case ActionTypes.SET_CITY_DROPDOWN_OPTIONS: {
      newState.formDetails.cityDropdownOptions = action.payload;
      return newState;
    }
    // case ActionTypes.SET_VENDOR_DROPDOWN_OPTIONS: {
    //   newState.formDetails.vendorDropdownOptions = action.payload;
    //   return newState;
    // }
    default:
      return newState;
  }
}
