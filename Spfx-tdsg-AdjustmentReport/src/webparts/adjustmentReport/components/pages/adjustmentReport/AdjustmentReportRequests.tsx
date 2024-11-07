import * as React from "react";
import { Button, Input, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import { displayRequestStatus } from "../../../utils/utility";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../CommonTable/CommonTable";
import { useCallback, useEffect, useState } from "react";
import { useGetAllAdjustmentReports } from "../../../hooks/useGetAllAdjustmentReports";
import { IAdjustmentReportInfo } from "../../../api/IAdjustmentReport";
import { DATE_FORMAT, STATUS_COLOUR_CLASS } from "../../../GLOBAL_CONSTANT";
import { displayRequestStatus } from "../../../utils/utility";
import * as dayjs from "dayjs";
import { useDeleteAdjustmentReport } from "../../../hooks/useDeleteAdjustmentReport";

export const DEFAULT_PAGE_SIZE = 10;
export type SortOrder = "descend" | "ascend" | null;

const AdjustmentReportRequests: React.FC = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortColumn, setSortColumn] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("desc");
  const [adjustmentReports, setAdjustmentReports] = useState<IAdjustmentReportInfo[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  const deleteMutation = useDeleteAdjustmentReport();

  const ViewHandler = (id: number): void => {
    const rowData = adjustmentReports.filter(
      (adjustmentReport) => adjustmentReport.AdjustmentReportId == id
    );
    sessionStorage.setItem("rowData", JSON.stringify(rowData));
    navigate(`/form/view/${id}`, { state: { isApproverRequest: false } });
  };

  const EditHandler = (id: any): void => {
    const rowData = adjustmentReports.filter(
      (adjustmentReport) => adjustmentReport.AdjustmentReportId == id
    );
    sessionStorage.setItem("rowData", JSON.stringify(rowData));
    navigate(`/form/edit/${id}`, { state: { isApproverRequest: false } });
    return;
  };
  // const handleEdit = (key: number) => {
  //   const rowData = masterSchedules.find(
  //     (schedule) => schedule.MasterScheduleId == key
  //   );
  //   sessionStorage.setItem("rowData", JSON.stringify(rowData));
  //   navigate(`/master-schedule/edit/${key}`, { state: { rowData } });
  // };

  const { data, isLoading, refetch } = useGetAllAdjustmentReports(
    pageIndex,
    pageSize,
    searchQuery,
    sortColumn,
    orderBy
  );

  useEffect(() => {
    void refetch();
  }, [refetch, searchQuery, pageIndex, pageSize, sortColumn, orderBy]);

  useEffect(() => {
    if (data?.ReturnValue) {
      setAdjustmentReports(data?.ReturnValue || []);
    }
  }, [data]);

  const onSearchClick = () => {
    setPageIndex(1);
    setOrderBy("desc");
    setSearchQuery(searchValue);
  };

  const refetchCallback = useCallback(refetch, [/* add necessary dependencies here */]);

  useEffect(() => {
    void refetchCallback();
  }, [refetchCallback, searchQuery, pageIndex, pageSize, sortColumn, orderBy]);


  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value === "") {
      setPageIndex(1);
      setSearchValue("");
      setSearchQuery("");
    }
  };

  // const handleEdit = (key: number) => {
  //   const rowData = masterSchedules.find(
  //     (schedule) => schedule.MasterScheduleId == key
  //   );
  //   sessionStorage.setItem("rowData", JSON.stringify(rowData));
  //   navigate(`/master-schedule/edit/${key}`, { state: { rowData } });
  // };

  // const handleView = (key: number) => {
  //   const rowData = masterSchedules.find(
  //     (schedule) => schedule.MasterScheduleId == key
  //   );
  //   sessionStorage.setItem("rowData", JSON.stringify(rowData));
  //   navigate(`/master-schedule/view/${key}`, { state: { rowData } });
  // };

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
  const onDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this report?");
    if (confirmed) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setAdjustmentReports(prevReports => prevReports.filter(report => report.AdjustmentReportId !== id));
          alert("Report deleted successfully!"); // Optional success message
        },
        onError: (error) => {
          alert(`Failed to delete report: ${error.message}`); // Optional error message
        }
      });
    }
  };

  const onExportToExcel = () => {
    console.log("Export to Excel");
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
      title: "Department",
      dataIndex: "DepartmentName",
      key: "DepartmentName",
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
      title: "When",
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
            onClick={() => ViewHandler(record.AdjustmentReportId)}
          />
          <Button
            type="link"
            title="Edit"
            icon={<EditFilled className="text-black" />} // Black icon
            onClick={() => EditHandler(record.AdjustmentReportId)}
          />
          <Button
            type="link"
            title="Delete"
            icon={<DeleteFilled className="text-black" />} // Black icon
            onClick={() => onDelete(record.AdjustmentReportId)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-5">
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
        <Button
          className="export-excel"
          onClick={() => onExportToExcel()}
          icon={<FileExcelOutlined />}
        >
          Export to Excel
        </Button>
      </div>
      <CommonTable<IAdjustmentReportInfo>
        bordered
        columns={columns}
        totalPage={data?.ReturnValue?.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        dataSource={adjustmentReports}
        onPageSizeChange={onPageSizeChange}
        onPaginationChange={onPaginationChange}
        setSortColumn={setSortingColumn}
        setOrderBy={setOrderColumn}
        loading={isLoading}
        style={{ borderRadius: 0 }}
      />
      {/* <Table columns={columns} dataSource={dataSource} /> */}
    </div>
  );
};

export default AdjustmentReportRequests;
