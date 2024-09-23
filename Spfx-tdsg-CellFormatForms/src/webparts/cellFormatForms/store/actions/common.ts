// local imports
import { IAction } from ".";
import { DropDownOptionType } from "../../components/utils/Handler/Dropdown";
import { IUserRole, IAuthUser } from "../reducers/common";
import { ActionTypes as types } from "../reducers/common";

export const setIsLoading = (value: boolean): IAction => ({
  type: types.SET_IS_LOADING,
  payload: value,
});

export const setTempRefNumber = (value: string): IAction => ({
  type: types.SET_TEMP_REF_NUMBER,
  payload: value,
});

export const isVisibleDraftButton = (value: string): IAction => ({
  type: types.IS_VISIBLE_DRAFT,
  payload: value,
});

export const setIsAdmin = (value: boolean): IAction => ({
  type: types.SET_IS_ADMIN,
  payload: value,
});

export const setUserRole = (value: IUserRole): IAction => ({
  type: types.SET_USER_ROLE,
  payload: value,
});

export const setAuthUser = (value: IAuthUser): IAction => ({
  type: types.SET_USER,
  payload: value,
});

export const setActiveFormSection = (value: number): IAction => ({
  type: types.SET_ACTIVE_FORM_SECTION,
  payload: value,
});

export const setFormSectionStatus = (value: string[]): IAction => ({
  type: types.SET_FORM_SECTION_STATUS,
  payload: value,
});

export const setCityOptions = (value: DropDownOptionType[]): IAction => ({
  type: types.SET_CITY_DROPDOWN_OPTIONS,
  payload: value,
});

export default {
  setIsLoading,
  setIsAdmin,
  setUserRole,
  setAuthUser,
  isVisibleDraftButton,
  // setTempnumber,
  setCityOptions,
  setActiveFormSection,
  setFormSectionStatus,
};
