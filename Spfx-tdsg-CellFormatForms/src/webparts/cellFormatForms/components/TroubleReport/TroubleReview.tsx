import React, { useEffect, useRef, useState } from "react";
import DashboardTable from "../Common/DashboardTable";
import type { ColumnsType } from "antd/es/table";
import {
  Button,
  Input,
  Space,
  TableColumnType,
  InputRef,
  message,
  Table,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FilterDropdownProps } from "antd/es/table/interface";
import {
  getReviseDataListing,
  getTroubleReportListing,
  getTroubleReviewListing,
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
  Levels,
  REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
} from "../GLOBAL_CONSTANT";
import { NestedData, NestedDataItem } from "./RequestSection";

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
  Title: string;
  SrNoPrefix?: string;
  TroubleReportNo: string;
  CreatedDate: string;
  CreatedBy: string;
  Status: string;
  SimilarEntries?: DataType[];
  EmployeeName?: string;
  WorkDoneLead?: string;
  CurrentApprover?: string;
  Process?: string;
  IsReOpen: boolean;
  workDoneMembersIds: number[];
  workDoneManagerId: number; //workDone Lead's RM
  reportingManagerId: number; //raiser's RM
  ReportLevel: number; //level as to where is the form
  currentProcessor: number[];
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

const TroubleReview: React.FC = () => {
  dayjs.extend(customParseFormat);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [reloadData, setReloadData] = useState(0);
  const [tableData, setTableData] = useState<IGetTroubleReportListing[]>([]);
  const [nestedData, setNestedData] = useState<NestedData>({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const navigate = useNavigate();

  const ViewHandler = (id: any): void => {
    navigate(`/form/view/${id}`, {
      state: {
        fromReviewTab: true,
      },
    });
  };

  const EditHandler = (id: any) => {
    navigate(`/form/edit/${id}`, {
      state: {
        fromReviewTab: true,
      },
    });
    return;
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

  const DeleteHandler = (): void => {
    console.log("delete record");
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
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
    ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Trouble Report No",
      dataIndex: "TroubleReportNo",
      key: "TroubleReportNo",
      sorter: true,
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      ...getColumnSearchProps("TroubleReportNo", "Search Trouble Report No."),
    },
    {
      title: "Report Title",
      dataIndex: "Problem",
      key: "Problem",
      sorter: true,
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      ...getColumnSearchProps("Problem", "Search Report Title"),
    },
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      sorter: true,
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      ...getColumnSearchProps("Process", "Search Process"),
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
      ...getColumnSearchProps("CreatedDate", "Search Created Date"),
    },
    {
      title: "Raiser Name",
      dataIndex: "EmployeeName",
      key: "EmployeeName",
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      sorter: true,
      ...getColumnSearchProps("EmployeeName", "Search Raiser Name"),
    },
    {
      title: "WorkDone Lead",
      dataIndex: "WorkDoneLead",
      key: "WorkDoneLead",
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      sorter: true,
      // sorter: (a, b) => a.CreatedBy.localeCompare(b.EmployeeName),
      ...getColumnSearchProps("WorkDoneLead", "Search WorkDone Lead Name"),
    },
    {
      title: "Current Approver",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      sorter: true,
      // width: "10%", // Adjusted to 10%
      ...getColumnSearchProps("CurrentApprover", "Search Current Approver"),
    },
    {
      title: "Status",
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
      ...getColumnSearchProps("Status", "Search Status"),
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
          {console.log(
            "COND",
            record.TroubleReportNo,
            record.reportingManagerId,
            EMPLOYEE_ID,
            record.ReportLevel,
            record.Status == REQUEST_STATUS.InProcess
          )}
          {!record.IsReOpen &&
            record.Status !== REQUEST_STATUS.Completed &&
            record.Status !== REQUEST_STATUS.UnderReview &&
            record.currentProcessor?.includes(EMPLOYEE_ID) &&
            record.workDoneManagerId !== EMPLOYEE_ID &&
            (!(
              (record.workDoneMembersIds?.length > 0 &&
                record.workDoneMembersIds.includes(EMPLOYEE_ID)) ||
              (record.reportingManagerId === EMPLOYEE_ID &&
                (record.ReportLevel > Levels.Level2 ||
                  record.Status === REQUEST_STATUS.ReviewDeclined))
            ) ||
              (record.reportingManagerId === EMPLOYEE_ID &&
                record.ReportLevel < Levels.Level2 &&
                record.Status === REQUEST_STATUS.InProcess)) && (
              <button
                onClick={() => EditHandler(record.TroubleReportId)}
                type="button"
                style={{ background: "none", border: "none" }}
              >
                <span>
                  <i title="Edit" className="fas fa-edit text-primary" />
                </span>
              </button>
            )}

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
      // width: "5%", // Adjusted to 5%
    },
  ];

  const fetchNestedData = async (expanded: boolean, record: any) => {
    if (expanded) {
      try {
        setLoading(true);
        const res = await getReviseDataListing(record.TroubleReportId);
        if (res) {
          const newData: NestedDataItem[] = res.map(
            (item: NestedDataItem, index: number) => ({
              ...item,
              SrNo: (index + 1).toString(),
            })
          );

          setNestedData((prevData) => {
            // Create a new object to avoid mutating the state directly
            const updatedData = { ...prevData };

            // Replace or add new data for the current TroubleReportId
            updatedData[record.TroubleReportId] = newData;

            return updatedData;
          });

          return { ...nestedData, [record.TroubleReportId]: newData };
        }
        return nestedData;
      } catch (error) {
        console.error("Error fetching nested data:", error);
        return [];
      } finally {
        setLoading(false);
      }
    }
  };

  const expandedRowRender = (record: any) => {
    const troubleReportId = record.TroubleReportId;

    const dataSource: any = nestedData[troubleReportId] || [];
    console.log("NestedDatasOURCE", dataSource);
    const nestedColumns: ColumnsType<any> = [
      // {
      //   title: "Sr.No.",
      //   dataIndex: "TroubleReportId",
      //   key: "TroubleReportId",
      //   width: "5%",
      // },
      {
        dataIndex: "TroubleReportNo",
        key: "TroubleReportNo",
        // width: "15%",
        render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      },
      {
        dataIndex: "Problem",
        key: "Problem",
        // width: "20%",
        render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      },
      {
        dataIndex: "Process",
        key: "Process",
        // width: "10%",
        render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      },
      {
        dataIndex: "CreatedDate",
        key: "CreatedDate",
        // width: "15%",
        render: (text) => (
          <p className="text-cell">
            {text ? dayjs(text, EXCEL_DATE_FORMAT).format(DATE_FORMAT) : "-"}
          </p>
        ),
      },
      {
        dataIndex: "EmployeeName",
        key: "EmployeeName",
        // width: "15%",
        render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      },
      {
        // title: "WorkDone Lead",
        dataIndex: "WorkDoneLead",
        key: "WorkDoneLead",
        render: (text) => <p className="text-cell">{text ?? "-"}</p>,
        // width: "10%",
      },
      {
        // title: "Current Approver",
        dataIndex: "CurrentApprover",
        key: "CurrentApprover",
        render: (text) => <p className="text-cell">{text ?? "-"}</p>,
        // width: "10%",
      },
      {
        dataIndex: "Status",
        key: "Status",
        render: (text) => (
          <span
            className={`status-badge status-badge-${
              STATUS_COLOUR_CLASS[text] ?? ""
            }`}
          >
            {text ? displayRequestStatus(text) : "-"}
          </span>
        ),
        // width: "10%",
      },
      {
        key: "action",
        render: (_, record) => (
          <div className="action-cell">
            <button
              onClick={() => ViewHandler(2)}
              type="button"
              style={{ background: "none", border: "none" }}
            >
              <span>
                <i title="View" className="fas fa-eye" />
              </span>
            </button>
          </div>
        ),
        sorter: false,
        // width: "10%",
      },
    ];
    return (
      <>
        <Table
          loading={dataSource?.length > 0 ? false : loading}
          className="custom-nested-table dashboard-nested-table"
          dataSource={dataSource}
          columns={nestedColumns}
          pagination={false}
          showHeader={false}
        />
      </>
    );
  };

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
      const data = await getTroubleReviewListing(createdOne, pagination);
      if (data) {
        const processedData = data.items.map((item, index) => ({
          ...item,
          SrNo: (index + 1).toString(),
          Status: item.Status.trim(),
        }));

        setTableData(processedData);

        console.log("Fetched review Listing res:", processedData);
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
    // fetchData().catch((error) => {
    //   console.error("Unhandled promise rejection in fetchData:", error);
    //   // Handle or log the error as needed
    // });
  }, []);

  useEffect(() => {
    captureEmailApprovalRedirection();
  }, []);

  return (
    <div
      className="tab-pane fade show active"
      id="myrequest-tab-pane"
      role="tabpanel"
      aria-labelledby="myrequest-tab"
      tabIndex={0}
    >
      <div
        className="tab-pane fade show active"
        id="myrequest-tab-pane"
        role="tabpanel"
        aria-labelledby="myrequest-tab"
        tabIndex={0}
      >
        <DashboardTable
          tableClass="dashboard-table"
          setSearchColumn={setSearchedColumn}
          tab={2}
          fetchData={fetchData}
          rowKey={(record: any) => record.TroubleReportNo}
          reloadData={reloadData}
          columns={columns}
          renderNestedRecords={fetchNestedData}
          expandedRowRender={expandedRowRender}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default TroubleReview;
