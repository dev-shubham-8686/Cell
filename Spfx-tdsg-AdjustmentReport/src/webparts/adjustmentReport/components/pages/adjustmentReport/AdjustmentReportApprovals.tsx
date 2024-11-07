import { Button, Input, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DATE_FORMAT, STATUS_COLOUR_CLASS } from "../../../GLOBAL_CONSTANT";
import * as dayjs from "dayjs";
import { displayRequestStatus } from "../../../utils/utility";
import {
  EyeFilled,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CommonTable from "../../CommonTable/CommonTable";
import { IAdjustmentReportInfo } from "../../../api/IAdjustmentReport";
import { useCallback, useEffect, useState } from "react";
import { useGetApprovalList } from "../../../hooks/useGetApprovalList";
import { useUserContext } from "../../../context/UserContext";


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

  const {user} = useUserContext();

  const ViewHandler = (id: any): void => {
    navigate(`/form/view/${id}`, { state: { isApproverRequest: true } });
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

  const onSearchChange = () => {
    console.log("Clicked Search");
  };

  const onExportToExcel = () => {
    console.log("Export to Excel");
  };

  const columns: ColumnsType<IAdjustmentReportInfo> = [
    {
      title: "Request No",
      dataIndex: "RequestNo",
      key: "RequestNo",
      width: 160,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      width: 160,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Requestor",
      dataIndex: "CreatedBy",
      key: "CreatedBy",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "When Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: 140,
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
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
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
            onClick={() => ViewHandler(record.AdjustmentReportId)}
          />
          {/* <Button
            type="link"
            title="Edit"
            icon={<EditFilled className="text-black" />} // Black icon
            onClick={() => ViewHandler(record.requestNo)}
          />
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
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Search Here"
            value={searchQuery}
            onChange={(e: any) => {
              setSearchQuery(e.target.value);
            }}
          />
          <div className="position-relative">
            {searchQuery && (
              <i
                className="fa-solid fa-times position-absolute text-gray font-18"
                style={{
                  left: "-2.25rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSearchQuery("");
                }}
              />
            )}
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => onSearchChange()}
            >
              <i className="fa-solid fa-magnifying-glass me-1" /> Search
            </Button>
          </div>
        </div>

        {/* Export to Excel button on the right */}
        <Button
          type="primary"
          className="export-excel"
          onClick={() => onExportToExcel()}
          icon={<FileExcelOutlined />}
        >
          Export to Excel
        </Button>
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
