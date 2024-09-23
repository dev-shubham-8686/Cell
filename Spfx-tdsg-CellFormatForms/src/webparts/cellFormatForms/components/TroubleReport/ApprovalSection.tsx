import React, { useEffect, useRef, useState } from "react";
import DashboardTable from "../Common/DashboardTable";
import type { ColumnsType } from "antd/es/table";
import { Button, Input, Space, TableColumnType, InputRef, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FilterDropdownProps } from "antd/es/table/interface";
import {
  getTroubleAppprovalListing,
  IGetTroubleReportListing,
  IGetTroubleRequestsResponse,
  IPagination,
} from "../utils/Handler/Listing";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import {
  captureEmailApprovalRedirection,
  displayRequestStatus,
} from "../utils/utility";
import {
  DATE_FORMAT,
  EXCEL_DATE_FORMAT,
  STATUS_COLOUR_CLASS,
} from "../GLOBAL_CONSTANT";

export type IStatus =
  | "Pending"
  | "Submitted"
  | "Need-Correction"
  | "Reviewed"
  | "Review-Rejected"
  | "Need-Review-in-Rejection"
  | "Approved"
  | "Rejected"
  | "Under-Amendment";

export interface DataType {
  Problem?: string;
  key: number;
  TroubleReportId: number;
  SrNo: string;
  Title: string;
  SrNoPrefix?: string;
  TroubleReportNo: string;
  CreatedDate: string;
  CreatedBy: string;
  Status: string;
  SimilarEntries?: DataType[];
  EmployeeName?: string;
  CurrentApprover?: string;
  Process?: string;
  ApproverTaskStatus?: string;
  WorkDoneLead?: string;
}

type DataIndex = keyof DataType;

interface ExportReportBoxProps {
  buttonText: string;
  onCancel: () => void; // Define onCancel prop
  onFinish: (values: any) => Promise<void>; // Add onFinish prop
}
// const generateSrNo = (prefix: string | undefined, index: number): string => {
//   const base = prefix ? prefix + "-" : "";
//   return base + (index + 1).toString().padStart(2, "0");
// };

const TroubleApproval: React.FC = () => {
  dayjs.extend(customParseFormat);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [reloadData, setReloadData] = useState(0);
  const [tableData, setTableData] = useState<IGetTroubleReportListing[]>([]);
  const [filters, setFilters] = useState({});

  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const navigate = useNavigate();

  const ViewHandler = (id: any): void => {
    navigate(`/form/view/${id}`, {
      state: { isApproverRequest: true },
    });
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ): void => {
    confirm();
    setFilters({
      ...filters,
      [dataIndex]: selectedKeys[0],
    });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
    setSearchText("");
    setFilters({});
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    inputPlaceholder: string
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={inputPlaceholder}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            handleSearch(selectedKeys as string[], confirm, dataIndex);
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              // if (clearFilters) handleReset(clearFilters);
              // setSelectedKeys(selectedKeys);
              handleSearch(selectedKeys as string[], confirm, dataIndex);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              // setSelectedKeys([""])
              if (clearFilters) handleReset(clearFilters);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            <i className="fa-solid fa-xmark" />
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
    ),
  });

  const columns: ColumnsType<any> = [
    {
      title: "Trouble Report No",
      dataIndex: "TroubleReportNo",
      key: "TroubleReportNo",
      sorter: true,
      ...getColumnSearchProps("TroubleReportNo", "Search TroubleReport No"),
      // width: "15%", // 15%
    },
    {
      title: "Report Title",
      dataIndex: "Problem",
      key: "Problem",
      sorter: true,
      ...getColumnSearchProps("Problem", "Search Problem"),
      // width: "20%", // 20%
    },
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      sorter: true,
      ...getColumnSearchProps("Process", "Search Process"),
      // width: "10%", // 10%
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (text) => (
        <p className="text-cell">
          {text ? dayjs(text, EXCEL_DATE_FORMAT).format(DATE_FORMAT) : "-"}
        </p>
      ),
      sorter: true,
      // width: "15%", // 15%
      ...getColumnSearchProps("CreatedDate", "Search Created Date"),
    },
    {
      title: "Raiser Name",
      dataIndex: "EmployeeName",
      key: "EmployeeName",
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      sorter: true,
      // width: "10%", // Adjusted to 10%
      ...getColumnSearchProps("EmployeeName", "Search Raiser Name"),
    },
    {
      title: "WorkDone Lead",
      dataIndex: "WorkDoneLead",
      key: "WorkDoneLead",
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      sorter: true,
      // sorter: (a, b) => a.CreatedBy.localeCompare(b.EmployeeName),
      // width: "10%", // Adjusted to 10%
      ...getColumnSearchProps("WorkDoneLead", "Search WorkDone Lead"),
    },
    {
      title: "Request Status",
      dataIndex: "Status",
      key: "Status",
      render: (text) => (
        <span
          className={`status-badge status-badge-${
            STATUS_COLOUR_CLASS[text] ?? ""
          }`}
        >
          {displayRequestStatus(text)}
        </span>
      ),
      sorter: true,
      // width: "10%", // 10%
      ...getColumnSearchProps("Status", "Search Request Status"),
    },
    {
      title: "Approver Status",
      dataIndex: "ApproverTaskStatus",
      key: "ApproverTaskStatus",
      render: (text) => (
        <span
          className={`status-badge status-badge-${
            STATUS_COLOUR_CLASS[text] ?? ""
          }`}
        >
          {displayRequestStatus(text)}
        </span>
      ),
      sorter: true,
      // width: "10%", // 10%
      ...getColumnSearchProps("ApproverTaskStatus", "Search Approver Status"),
    },
    {
      title: <p className="text-center p-0 m-0">Action</p>,
      key: "action",
      render: (_, record) => (
        <div className="action-cell">
          <button
            onClick={() => ViewHandler(record.TroubleReportId)}
            type="button"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <i title="View" className="fas fa-eye text-primary" />
            </span>
          </button>

          {/* <button
            onClick={() => EditHandler(record.TroubleReportId)}
            type="button"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <i title="Edit" className="fas fa-edit" />
            </span>
          </button> */}

          {/* <button
            onClick={DeleteHandler}
            type="button"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <i title="Delete" className="fas fa-trash text-danger" />
            </span>
          </button> */}
        </div>
      ),
      sorter: false,
    },
  ];

  const fetchData = async ({
    pageIndex,
    pageSize,
    order,
    sorting,
    search,
    columnName,
  }: {
    pageIndex: number;
    pageSize: number;
    order?: string;
    sorting?: string;
    search?: string;
    columnName?: string;
  }): Promise<IGetTroubleRequestsResponse> => {
    try {
      const createdOne = EMPLOYEE_ID;
      const pagination: IPagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        order: sorting || "",
        orderBy: order || "",
        searchColumn: searchedColumn,
        searchValue: searchedColumn ? searchText : search,
      };
      const data = await getTroubleAppprovalListing(createdOne, pagination);
      if (data) {
        const processedData = data.items.map((item, index) => ({
          ...item,
          SrNo: (index + 1).toString(),
          Status: item.Status.trim(),
        }));

        setTableData(processedData);

        console.log("Fetched Approval data:", processedData);
        return data;
      } else {
        setTableData([]);
        console.log("No data fetched.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      await message.error("Failed to fetch data.");
      setTableData([]); // Set empty array in case of error
    }
  };

  useEffect(() => {
    captureEmailApprovalRedirection();
  }, []);

  useEffect(() => {
    // fetchData().catch((error) => {
    //   console.error("Unhandled promise rejection in fetchData:", error);
    //   // Handle or log the error as needed
    // });
  }, []);

  return (
    <div
      className="tab-pane fade show active"
      id="myrequest-tab-pane"
      role="tabpanel"
      aria-labelledby="myrequest-tab"
      tabIndex={0}
    >
      <div className="row">
        {/* <div className="col-md-4">
          <div className="d-flex gap-3 mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Search Here"
              value={searchTableText}
              onChange={SearchTableHandler}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  SearchTableHandler(e.target.value);
                }
              }}
            />
            <button className="btn btn-primary text-nowrap">
              <i className="fa-solid fa-magnifying-glass me-1" /> Search
            </button>
          </div>
        </div>
        <div className="col-md-4" />
        <div className="col-md-4 text-end">
          <button
            className="btn btn-outline-darkgrey text-nowrap"
            onClick={handleExportButtonClick}
          >
            <i className="fa-solid fa-file-export me-1" />
            Export to Excel
          </button>

          <ExportReportBox
            ref={exportReportBoxRef}
            onFinish={handleExportFormSubmit}
            buttonText=""
            onCancel={undefined}
          />
        </div> */}
      </div>

      <div
        className="tab-pane fade show active"
        id="myrequest-tab-pane"
        role="tabpanel"
        aria-labelledby="myrequest-tab"
        tabIndex={0}
      >
        <DashboardTable
          tab={3}
          tableClass="dashboard-table"
          renderNestedRecords={null}
          fetchData={fetchData}
          rowKey={(record: any) => record.TroubleReportNo}
          reloadData={reloadData}
          columns={columns}
          expandedRowRender={null}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
};

export default TroubleApproval;
