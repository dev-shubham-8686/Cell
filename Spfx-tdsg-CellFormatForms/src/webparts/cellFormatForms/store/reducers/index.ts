import { combineReducers } from "redux"
import Common from "./common"
import Pagination from "./pagination"

const rootReducer = combineReducers({ Common,Pagination })
export type IAppState = ReturnType<typeof rootReducer>
export default rootReducer
