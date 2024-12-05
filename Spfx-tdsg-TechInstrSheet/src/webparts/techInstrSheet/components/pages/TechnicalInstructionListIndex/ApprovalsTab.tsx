import Table, { ColumnsType, TablePaginationConfig } from "antd/es/table";
//import dayjs from "dayjs";
import * as React from "react";
import {
  REQUEST_STATUS,
  //REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
} from "../../../GLOBAL_CONSTANT";
import { displayRequestStatus } from "../../../utils/utility";
import { Button, Input, notification, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //faEdit,
  faEye,
  faFileExport,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../context/userContext";
import {
  fetchTechnicalInstructionsApprovalList,
  technicalPDF,
} from "../../../api/technicalInstructionApi";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ExportToExcel from "../../common/ExportToExcel";
import { downloadPDF } from "../../../api/utility/utility";
import displayjsx from "../../../utils/displayjsx";

const ApprovalsTab: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const exportRef = React.useRef<any>();
  //const [searchValue, setSearchValue] = React.useState<string>('');
  const [searchColumn, setSearchColumn] = React.useState<string>("");
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });
  const [sorter, setSorter] = React.useState({ order: "", orderBy: "" });
  const user = React.useContext(UserContext);

  const loadData = React.useCallback((params: any) => {
    setLoading(true);
    fetchTechnicalInstructionsApprovalList({
      pagination: params.pagination,
      sorter: params.sorter,
      searchColumn: params.searchColumn,
      searchText: params.searchText,
      createdBy: user?.employeeId, // Pass the createdBy from user context
    })
      .then((resultData) => {
        setLoading(false);
        setData(resultData); // Set the returned data
        setPagination({
          ...params.pagination,
          total: resultData.length > 0 ? resultData[0].totalCount : 0,
        });
      })
      .catch((error) => {
        setLoading(false);
        notification.error({
          message: "Failed to load data",
          description: error.message,
        });
      });
  }, []);

  React.useEffect(() => {
    loadData({ pagination, sorter, searchText, searchColumn });
  }, [
    pagination.current,
    pagination.pageSize,
    sorter.order,
    sorter.orderBy,
    searchText,
    searchColumn,
  ]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: any
  ) => {
    setPagination(pagination);
    setSorter({
      order:
        sorter.order === "ascend"
          ? "ASC"
          : sorter.order === "descend"
          ? "DESC"
          : "",
      orderBy: sorter.field || "",
    });
  };

  const handleSearch = (): void => {
    loadData({ pagination, sorter, searchText });
  };

  const handleExportToExcel = (): void => {
    if (exportRef.current) {
      exportRef.current.openModal();
    }
  };

  const handleColumnSearch = (
    selectedKeys: any,
    confirm: any,
    dataIndex: string
  ) => {
    confirm();
    setSearchColumn(dataIndex);
    setSearchText(selectedKeys[0] || "");
  };

  const handleColumnReset = (clearFilters: any) => {
    clearFilters();
    setSearchColumn("");
    setSearchText("");
  };

  // Column-specific search filter
  const getColumnSearchProps = (dataIndex: string, placeholderString: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${placeholderString}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleColumnSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleColumnReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(
          () => document.getElementById(`search-${dataIndex}`)?.focus(),
          100
        );
      }
    },
  });

  const handleView = (id: string): void => {
    navigate(`/form/view/${id}`, { state: { isApproverRequest: true } });
  };

  // const handleEdit = (id: string): void => {
  //   navigate(`/form/edit/${id}`, { state: { isApproverRequest: true } });
  // };

  const handlePdf = (id: string, no: string): void => {
    setPdfLoading(true);
    technicalPDF(id)
      .then((data) => {
        setPdfLoading(false);
        downloadPDF(data.ReturnValue, no);
        void displayjsx.showSuccess("PDF downloaded successfully.");
      })
      .catch((errr) => {
        setPdfLoading(false);
        console.log(errr);
      });
  };

  const columns: ColumnsType<any> = [
    {
      title: "Request No",
      dataIndex: "CTINumber",
      key: "CTINumber",
      width: "20%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("CTINumber","Request No"),
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      width: "15%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("Department","Department"),
    },
    {
      title: "Requestor",
      dataIndex: "Requestor",
      key: "Requestor",
      width: "15%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("Requestor","Requestor"),
    },
    {
      title: "Requested Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: "15%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY") : ""}</span>
      ),
      ...getColumnSearchProps("CreatedDate","Requested Date"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: "15%",
      sorter: true,
      ...getColumnSearchProps("Status","Status"),
      render: (text) => (
        <span
          className={`status-badge status-badge-${
            STATUS_COLOUR_CLASS[text] ?? ""
          }`}
        >
          {displayRequestStatus(text)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "text-center",
      sorter: false,
      width: "10%",
      render: (_, record) => (
        <span className="action-cell">
          <Button
            title="View"
            className="action-btn"
            icon={<FontAwesomeIcon title="View" icon={faEye} />}
            onClick={() => handleView(record.TechnicalId)}
          />

          {record.seqNumber == 1 &&
            (user?.isAdmin ||
              record.Status == REQUEST_STATUS.Closed ||
              record.Status == REQUEST_STATUS.Completed ||
              record.Status == REQUEST_STATUS.Approved) && (
              <Button
                title="PDF"
                className="action-btn"
                icon={<FontAwesomeIcon title="PDF" icon={faFilePdf} />}
                onClick={() => handlePdf(record.TechnicalId, record.CTINumber)}
              />
            )}

          {/* {record.ApproverTaskStatus == REQUEST_STATUS.InReview &&
            (record.seqNumber == 1 || record.seqNumber == 2 || record.seqNumber == 3) && (
              <Button
                title="Edit"
                className="action-btn"
                icon={<FontAwesomeIcon title="Edit" icon={faEdit} />}
                onClick={() => handleEdit(record.TechnicalId)}
              />
            )} */}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3 items-center">
          <div style={{ position: "relative", display: "inline-block" }}>
            <Input
              type="text"
              placeholder="Search Here"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "300px" }}
            />
            {searchText && (
              <CloseOutlined
                onClick={() => setSearchText("")}
                className="text-gray-400 cursor-pointer"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  cursor: "pointer",
                }}
              />
            )}
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="whitespace-nowrap"
          >
            Search
          </Button>
        </div>

        {/* Export to Excel button */}
        <Button
          className="bg-blue-600 text-white font-bold px-6 py-2"
          onClick={handleExportToExcel}
        >
          <FontAwesomeIcon title="View" icon={faFileExport} className="me-1" />
          Export to Excel
        </Button>
        <ExportToExcel ref={exportRef} type={"2"} />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{...pagination, showTotal: (total, range) => (
          <div className="d-flex align-items-center gap-3">
            <span style={{ marginRight: "auto" }}>
                Showing {range[0]}-{range[1]} of {total} items
              </span>
            </div>
        )}}
        loading={loading}
        onChange={handleTableChange}
        rowKey="TechnicalId"
        scroll={{ x: true }}
        className="w-full shadow-sm no-radius-table"
      />

      <Spin spinning={pdfLoading} fullscreen />
    </div>
  );
};

export default ApprovalsTab;
