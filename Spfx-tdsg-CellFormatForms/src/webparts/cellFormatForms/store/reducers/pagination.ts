
import { TablePaginationConfig } from "antd"
import { SortOrder } from "antd/lib/table/interface"
import { IAction } from "./common"
import { types as ActionTypes } from "../actions/pagination"


export type IPaginationItems = {
  pagination: TablePaginationConfig
  sortBy: string
  orderBy: SortOrder
  search:string
}

type IState = {
  dcListing: IPaginationItems
}

const defaultPaginationItemsValue: IPaginationItems = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  },
  sortBy: "",
  orderBy: "ascend",
  search:""
 // filters: [],
}

const initiaslState: IState = {
  dcListing: { ...defaultPaginationItemsValue },
}

export default function paginationReducer(
  state: IState = initiaslState,
  action: IAction
) {
  let newState = (<any>Object).assign({}, state) as IState

  switch (action.type) {
    case ActionTypes.SET_CF_LISTING: {
      newState.dcListing = { ...action.payload }
      return newState
    }
    default:
      return newState
  }
}
