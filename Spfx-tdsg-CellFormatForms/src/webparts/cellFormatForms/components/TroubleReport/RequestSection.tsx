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
  Modal,
} from "antd";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FilterDropdownProps } from "antd/es/table/interface";
import {
  getReviseDataListing,
  getTroubleReportListing,
  IGetTroubleReportListing,
  IGetTroubleRequestsResponse,
  IPagination,
} from "../utils/Handler/Listing";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import {
  allowedEditInRequests,
  DATE_FORMAT,
  EXCEL_DATE_FORMAT,
  REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
} from "../GLOBAL_CONSTANT";
import {
  captureEmailApprovalRedirection,
  displayRequestStatus,
} from "../utils/utility";
import { IState } from "../../store/reducers/common";
import { DeleteTroubleReport } from "../utils/Handler/FormSubmission";

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
  WorkDoneLead?: string;
  CurrentApprover?: string;
  Process?: string;
  IsEditable: number;
}

type DataIndex = keyof DataType;

export interface NestedDataItem {
  TroubleReportId: number;
  TroubleReportNo: string;
  CreatedDate: string;
  CreatedBy: string;
  Status: string;
}

export interface NestedData {
  [troubleReportId: number]: NestedDataItem[];
}

interface ExportReportBoxProps {
  buttonText: string;
  onCancel: () => void; // Define onCancel prop
  onFinish: (values: any) => Promise<void>; // Add onFinish prop
}
// const generateSrNo = (prefix: string | undefined, index: number): string => {
//   const base = prefix ? prefix + "-" : "";
//   return base + (index + 1).toString().padStart(2, "0");
// };

const RequestSection: React.FC = () => {
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

  const isAdmin = useSelector<IAppState, boolean>(
    (state) => state.Common.userRole.isAdmin
  );

  const DEPARTMENT_HEAD_EMP_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const navigate = useNavigate();

  const ViewHandler = (id: any): void => {
    navigate(`/form/view/${id}`, {
      state: { isApproverRequest: false },
    });
  };

  const EditHandler = (id: any) => {
    navigate(`/form/edit/${id}`, {
      state: { isApproverRequest: false },
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

      const data = await getTroubleReportListing(createdOne, pagination);
      if (data) {
        const processedData =
          data?.items?.map((item, index) => ({
            ...item,
            SrNo: (index + 1).toString(),
            Status: item.Status?.trim(),
          })) ?? [];

        setTableData(processedData);

        console.log(" Listing TroubleReport res", processedData);
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

  const DeleteRecord = async (id: any) => {
    try {
      await DeleteTroubleReport(parseInt(id));
      setReloadData((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete vehicle request:", error);
    }
  };

  const deleteHandler = async (id: number): Promise<void> => {
    Modal.confirm({
      title: (
        <p className="text-black-50_e8274897">
          Do you want to delete this request?
        </p>
      ),
      icon: (
        <ExclamationCircleOutlined
          style={{ fontSize: "24px", color: "#faad14" }}
        />
      ),
      okText: "Yes",
      cancelButtonProps: { className: "btn btn-outline-primary" },
      okButtonProps: { className: "btn btn-primary" },
      onOk() {
        DeleteRecord(id).catch((e) =>
          console.error("Error while deleting the request:", e)
        );
      },
      // centered: true,
    });
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

  const columns: ColumnsType<DataType> = [
    // {
    //   title: "Sr.No.",
    //   dataIndex: "SrNo",
    //   key: "SrNo",
    //   // sorter: (a, b) => parseInt(a.SrNo) - parseInt(b.SrNo),
    //   // ...getColumnSearchProps("SrNo"),
    //   width: "5%", // 5%
    //   render: (_, record, index) => index + 1,
    // },
    {
      title: "Trouble Report No",
      dataIndex: "TroubleReportNo",
      key: "TroubleReportNo",
      sorter: true,
      // sorter: (a, b) => a.TroubleReportNo.localeCompare(b.TroubleReportNo),
      ...getColumnSearchProps("TroubleReportNo", "Search Trouble Report No."),
      // width: "15%", // 15%
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
    },
    {
      title: "Report Title",
      dataIndex: "Problem",
      key: "Problem",
      sorter: true,
      // sorter: (a, b) => a.title.localeCompare(b.Problem),
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      ...getColumnSearchProps("Problem", "Search Report Title"),
      // width: "20%", // 20%
    },
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      sorter: true,
      // sorter: (a, b) => a.title.localeCompare(b.Process),
      ...getColumnSearchProps("Process", "Search Process"),
      // width: "10%", // 10%
      render: (text) => <p className="m-0">{text ?? "-"}</p>,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      sorter: true,
      // sorter: (a, b) => a.CreatedDate.localeCompare(b.CreatedDate),
      // width: "15%", // 15%
      render: (text) => (
        <p className="text-cell">
          {text ? dayjs(text, EXCEL_DATE_FORMAT).format(DATE_FORMAT) : "-"}
        </p>
      ),
      ...getColumnSearchProps("CreatedDate", "Search Created Date"),
    },
    {
      title: "Raiser Name",
      dataIndex: "EmployeeName",
      key: "EmployeeName",
      render: (text) => <p className="text-cell">{text}</p>,
      sorter: true,
      // sorter: (a, b) => a.CreatedBy.localeCompare(b.EmployeeName),
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
      ...getColumnSearchProps("WorkDoneLead", "Search WorkDone Lead Name"),
    },
    {
      title: "Current Approver",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,

      sorter: true,
      // sorter: (a, b) => a.CreatedBy.localeCompare(b.CurrentApprover),
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
          {text ? displayRequestStatus(text) : "-"}
        </span>
      ),
      // sorter: (a, b) => a.Status.localeCompare(b.Status),

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
          {(isAdmin ||
            (record.IsEditable === 1 &&
              allowedEditInRequests.includes(record.Status))) && (
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
          {isAdmin && record.Status != REQUEST_STATUS.Completed && (
            <button
              onClick={() => deleteHandler(record.TroubleReportId)}
              type="button"
              style={{ background: "none", border: "none" }}
            >
              <span>
                <i title="Delete" className="fas fa-trash text-danger" />
              </span>
            </button>
          )}
        </div>
      ),
      sorter: false,
      // width: "5%",
    },
  ];

  const fetchNestedData = async (expanded: boolean, record: any) => {
    if (expanded) {
      setLoading(true);
      try {
        const res = await getReviseDataListing(record.TroubleReportId);
        if (res) {
          const newData: NestedDataItem[] = res.map(
            (item: NestedDataItem, index: number) => ({
              ...item,
              SrNo: (index + 1).toString(),
            })
          );
          console.log("nestedData res", nestedData);
          setNestedData((prevData) => {
            const updatedData = { ...prevData };
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
    const nestedColumns: ColumnsType<any> = [
      {
        dataIndex: "TroubleReportNo",
        key: "TroubleReportNo",
        // width: "15%",
        render: (text) => <p className="m-0">{text ?? "-"}</p>,
      },
      {
        dataIndex: "Problem",
        key: "Problem",
        // width: "20%",
        render: (text) => <p className="m-0">{text ?? "-"}</p>,
      },
      {
        dataIndex: "Process",
        key: "Process",
        // width: "10%",
        render: (text) => <p className="m-0">{text ?? "-"}</p>,
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
        render: (text) => <p className="m-0">{text ?? "-"}</p>,
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
              onClick={() => ViewHandler(record.TroubleReportId)}
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
          // scroll={{ x: "max-content" }}
        />
      </>
    );
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
          tab={1}
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

export default RequestSection;
