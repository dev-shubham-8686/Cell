import { Table, TablePaginationConfig } from "antd";
import { useEffect, useState } from "react";
import { ICommonTable } from "./ICommonTable";
import { SorterResult } from "antd/es/table/interface";
import * as React from "react";

const CommonTable = <T extends object>({
  dataSource,
  totalPage,
  columns,
  pageIndex,
  pageSize,
  rowKey,
  onPageSizeChange,
  onPaginationChange,
  setSortColumn,
  setOrderBy,
  expandable,
  scroll,
  expandedRowRender,
  pagination,
  ...rest
}: ICommonTable<T>) => {
  const [paginationConfig, setPaginationConfig] =
    useState<TablePaginationConfig>({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
    });

  useEffect(() => {
    setPaginationConfig((prev) => ({
      ...prev,
      current: pageIndex,
      total: totalPage,
    }));
  }, [totalPage, pageIndex]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, React.Key[] | null>,
    sorter: SorterResult<any>
  ) => {
    const { current, pageSize } = pagination;
    const { field, order } = sorter;

    let paginationChange = false;

    if (onPageSizeChange && pageSize !== paginationConfig.pageSize) {
      paginationChange = true;
      onPageSizeChange(1, pageSize || 10);
    }

    if (onPaginationChange) {
      onPaginationChange(paginationChange ? 1 : current || 1, pageSize);
    }

    if (setSortColumn && typeof field === "string") {
      setSortColumn(field);
    }

    if (setOrderBy && order) {
      setOrderBy(order === "ascend" ? "asc" : "desc");
    }

    setPaginationConfig((prev) => ({
      ...prev,
      current,
      pageSize,
    }));
  };

  return (
    <Table
      {...rest}
      dataSource={dataSource}
      columns={columns}
      rowKey={rowKey}
      
      pagination={paginationConfig}
      onChange={handleTableChange}
      expandable={expandable}
      scroll={scroll}
      // rowClassName={"bg-white-200"}
      expandedRowRender={expandedRowRender} // Added this line
    />
  );
};

export default CommonTable;
