import Common from "./common";
import Pagination from "./pagination";

export interface IAction {
  type: string;
  payload?: any;
}

export default {
  Common,
  Pagination,
};
export { Common, Pagination };
