import * as React from "react";
import { Button, Input, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { AnyObject } from "antd/es/_util/type";
import { DATE_FORMAT, STATUS_COLOUR_CLASS } from "../../../GLOBAL_CONSTANT";
import * as dayjs from "dayjs";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import { displayRequestStatus } from "../../../utils/utility";
import { useNavigate } from "react-router-dom";
import { displayRequestStatus } from "../../../utils/utility";

export type SortOrder = "descend" | "ascend" | null;

const AdjustmentReportRequests = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState("");

  const ViewHandler = (id: any): void => {
    navigate(`/form/view/${id}`, {
      state: { isApproverRequest: false, requestNo: id },
    });
  };

  const EditHandler = (id: any): void => {
    navigate(`/form/edit/${id}`, {
      state: { isApproverRequest: false },
    });
    return;
  };

  const onDelete = () => {
    console.log("delete");
  };

  const onSearchChange = () => {
    console.log("Clicked Search");
  };

  const onExportToExcel = () => {
    console.log("Export to Excel");
  };

  const columns: ColumnsType<AnyObject> = [
    {
      title: "Request No",
      dataIndex: "requestNo",
      key: "requestNo",
      width: 160,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 160,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Requestor",
      dataIndex: "requestor",
      key: "requestor",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "When Date",
      dataIndex: "whenDate",
      key: "whenDate",
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
          className={`status-badge status-badge-${
            STATUS_COLOUR_CLASS[text] ?? ""
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
            onClick={() => EditHandler(record.requestNo)}
          />
          <Button
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
          />
        </div>
      ),
    },
  ];

  const dataSource = [
    {
      Key: 1,
      requestNo: "ADJUST-001",
      department: "Quality Control (Module)",
      requestor: "Test1 SPO",
      whenDate: new Date(),
      status: "Close",
    },
    {
      Key: 2,
      requestNo: "ADJUST-002",
      department: "Quality Control (Module)",
      requestor: "Test1 SPO",
      whenDate: new Date(),
      status: "Completed",
    },
    {
      Key: 3,
      requestNo: "ADJUST-003",
      department: "Quality Control (Module)",
      requestor: "Test1 SPO",
      whenDate: new Date(),
      status: "Close",
    },
    {
      Key: 4,
      requestNo: "ADJUST-004",
      department: "Quality Control (Module)",
      requestor: "Test1 SPO",
      whenDate: new Date(),
      status: "Completed",
    },
    {
      Key: 5,
      requestNo: "ADJUST-005",
      department: "Quality Control (Module)",
      requestor: "Test1 SPO",
      whenDate: new Date(),
      status: "Close",
    },
  ];
  return (
    <div className="p-4 custom-table">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Search Here"
            value={searchText}
            onChange={(e: any) => {
              setSearchText(e.target.value);
            }}
          />
          <div className="position-relative">
            {searchText && (
              <i
                className="fa-solid fa-times position-absolute text-gray font-18"
                style={{
                  left: "-2.25rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSearchText("");
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
          className="export-excel"
          onClick={() => onExportToExcel()}
          icon={<FileExcelOutlined />}
        >
          Export to Excel
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default AdjustmentReportRequests;
