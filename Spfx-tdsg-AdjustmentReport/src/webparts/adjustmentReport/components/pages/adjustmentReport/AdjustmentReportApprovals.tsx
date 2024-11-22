import { Button, Input, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DATE_FORMAT, STATUS_COLOUR_CLASS } from "../../../GLOBAL_CONSTANT";
import { displayRequestStatus } from "../../../utils/utility";
import {
  EditFilled,
  EyeFilled,
  SearchOutlined,
} from "@ant-design/icons";
import CommonTable from "../../CommonTable/CommonTable";
import { useCallback, useEffect, useState } from "react";
import { useGetApprovalList } from "../../../hooks/useGetApprovalList";
import { useUserContext } from "../../../context/UserContext";
import * as dayjs from "dayjs";
import { IAdjustmentReportInfo } from "../../../interface";


export const DEFAULT_PAGE_SIZE = 10;
export type SortOrder = "descend" | "ascend" | null;

const AdjustmentReportApprovals = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortColumn, setSortColumn] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("desc");
  const [approvals, setApprovals] = useState<IAdjustmentReportInfo[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  const { user } = useUserContext();



  const ViewHandler = (id: any, type: string): void => {
    navigate(`/form/${type}/${id}`, { state: { isApproverRequest: true } });
  };

  const { data, isLoading, refetch } = useGetApprovalList(
    pageIndex,
    pageSize,
    searchQuery,
    sortColumn,
    orderBy,
    user?.EmployeeId
  );

  useEffect(() => {
    void refetch();
  }, [refetch, searchQuery, pageIndex, pageSize, sortColumn, orderBy]);

  useEffect(() => {
    if (data?.ReturnValue) {
      setApprovals(data?.ReturnValue || []);
    }
  }, [data]);


  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  }, []);

  const onPageSizeChange = useCallback((page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  }, []);

  const setSortingColumn = useCallback((column: string) => {
    setSortColumn(column);
  }, []);

  const setOrderColumn = useCallback((order: string) => {
    setOrderBy(order);
  }, []);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value === "") {
      setPageIndex(1);
      setSearchValue("");
      setSearchQuery("");
    }
  };

  const onSearchClick = () => {
    setPageIndex(1);
    setOrderBy("desc");
    setSearchQuery(searchValue);
  };

  const columns: ColumnsType<IAdjustmentReportInfo> = [
    {
      title: "Report No",
      dataIndex: "ReportNo",
      key: "ReportNo",
      width: 160,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "When",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: 160,
      sorter: true,
      render: (text) => (
        <p className="text-cell">
          {text ? dayjs(text).format(DATE_FORMAT) : ""}
        </p>
      ),
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Area",
      dataIndex: "AreaName",
      key: "AreaName",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Machine Name",
      dataIndex: "MachineName",
      key: "MachineName",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Sub-Machine Name",
      dataIndex: "SubMachineName",
      key: "SubMachineName",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Requestor",
      dataIndex: "Requestor",
      key: "Requestor",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Current Approver",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
      width: 140,
      sorter: true,
      render: (text) => (
        <span style={{ display: "flex", justifyContent: "center" }}>
          {text ? text : "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: 150,
      sorter: true,
      render: (text) => (
        <Tag
          bordered={false}
          className={`status-badge status-badge-${STATUS_COLOUR_CLASS[text] ?? ""
            }`}
        >
          {text ? displayRequestStatus(text) : "-"}{" "}
        </Tag>
      ),
      // filterDropdown: ColumnFilter,
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      // ),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      sorter: false,
      render: (_, record) => (
        <div className="flex">
          <Button
            type="link"
            title="View"
            icon={<EyeFilled className="text-black" />} // Black icon
            onClick={() => ViewHandler(record.AdjustmentReportId, "view")}
          />
          <Button
            type="link"
            title="Edit"
            icon={<EditFilled className="text-black" />} // Black icon
            onClick={() => ViewHandler(record.AdjustmentReportId, "edit")}
          />
          {/* 
          <Button
            type="link"
            title="Delete"
            icon={<DeleteFilled className="text-black" />} // Black icon
            onClick={() => onDelete()}
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 custom-table">
      <div className="flex justify-between items-center mb-3">
      <div className="flex gap-3 mb-3">
          <Input
            type="text"
            placeholder="Search Here"
            value={searchValue}
            onChange={handleInputChange}
            allowClear
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                onSearchClick();
              }
            }}
          />
          <div className="position-relative">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onSearchClick}
            >
              <i className="fa-solid fa-magnifying-glass me-1" /> Search
            </Button>
          </div>
        </div>

        {/* Export to Excel button on the right */}
        {/* <Button
          type="primary"
          className="export-excel"
          onClick={() => onExportToExcel()}
          icon={<FileExcelOutlined />}
        >
          Export to Excel
        </Button> */}
      </div>
      {/* <Table
        columns={columns}
        dataSource={dataSource}
        style={{ borderRadius: 0 }}
      /> */}
      <CommonTable<IAdjustmentReportInfo>
        bordered
        columns={columns}
        totalPage={data?.ReturnValue?.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        dataSource={approvals}
        onPageSizeChange={onPageSizeChange}
        onPaginationChange={onPaginationChange}
        setSortColumn={setSortingColumn}
        setOrderBy={setOrderColumn}
        loading={isLoading}
        style={{ borderRadius: 0 }}
      />
    </div>
  );
};

export default AdjustmentReportApprovals;
