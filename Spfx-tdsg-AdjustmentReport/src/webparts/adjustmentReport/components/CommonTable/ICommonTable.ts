import { TableProps } from "antd";
import { ColumnsType } from "antd/lib/table";

export interface ICommonTable<T>
  extends Omit<
    TableProps<T>,
    "columns" | "dataSource" | "pagination" | "rowKey"
  > {
  dataSource: T[];
  totalPage?: number;
  columns: ColumnsType<T>;
  pageIndex?: number;
  pageSize?: number;
  rowKey?: string;
  onPageSizeChange?: (current: number, size: number) => void;
  onPaginationChange?: (page: number, pageSize?: number) => void;
  expandable?: any;
  scroll?: { x?: number | string; y?: number | string };
  expandedRowRender?: (record: T) => React.ReactNode;
  setSortColumn?: (column: string) => void;
  setOrderBy?: (order: string) => void;
  pagination?: boolean;
}
