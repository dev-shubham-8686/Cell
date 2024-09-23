// local imports
import { IAction } from "."
import { IPaginationItems } from "../reducers/pagination"

export const types = {
  SET_CF_LISTING: "SET_CF_LISTING",
}


export const SetCFListing = (value: IPaginationItems): IAction => ({
  type: types.SET_CF_LISTING,
  payload: value,
})

export default {
  SetCFListing
}
