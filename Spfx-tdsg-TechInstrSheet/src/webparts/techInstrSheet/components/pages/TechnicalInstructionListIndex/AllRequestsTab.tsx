import * as React from "react";
import { Table, Button, Input, notification, Spin, Select, Form } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  deleteTechnicalInstruction,
  technicalPDF,
  // technicalExcel,
  technicalReviseList,
  //technicalReopen,
  fetchTechnicalInstructions,
  getAllEmployee,
  changeRequestOwner,
} from "../../../api/technicalInstructionApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faEdit,
  faEye,
  // faFileExcel,
  faFileExport,
  faFilePdf,
  faPaperclip,
  //faPlus,
  faRetweet,
  // faRepeat,
  faTrash,
  // faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import { REQUEST_STATUS, STATUS_COLOUR_CLASS } from "../../../GLOBAL_CONSTANT";
import {
  displayRequestStatus,
  // downloadExcelFile,
  downloadPDF,
} from "../../../api/utility/utility";
import { UserContext } from "../../../context/userContext";
import ExportToExcel from "../../common/ExportToExcel";
import displayjsx from "../../../utils/displayjsx";

const { Option } = Select;

const AllRequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  // const [excelLoading, setExcelLoading] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [reOpenLoading, setReOpenLoading] = React.useState(false);
  const exportRef = React.useRef<any>();
  //const [searchValue, setSearchValue] = React.useState<string>('');
  const [searchColumn, setSearchColumn] = React.useState<string>("");
  const [pagination, setPagination] = React.useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });
  const [sorter, setSorter] = React.useState({ order: "", orderBy: "" });
  const user = React.useContext(UserContext);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const [isSecondModalVisible, setIsSecondModalVisible] = React.useState(false);
  const [selectedOwner, setSelectedOwner] = React.useState<number | null>(null);
  const [selectedTICId, setSelectedTICId] = React.useState<string | null>(null);
  const [empData, setEmpData] = React.useState<any[]>([]);
  const [comment, setComment] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const loadData = React.useCallback((params: any) => {
    setLoading(true);
    fetchTechnicalInstructions({
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
    setExpandedRowKeys([]);
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
  const getColumnSearchProps = (
    dataIndex: string,
    placeholderString: string
  ) => ({
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
          style={{ width: 90, marginRight: 2 }}
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
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(
          () => document.getElementById(`search-${dataIndex}`)?.focus(),
          100
        );
      }
    },
  });

  const handleView = (id: string): void => {
    navigate(`/form/view/${id}`, {
      state: { isApproverRequest: false, isFromAllRequest: true },
    });
  };

  const handleEdit = (id: string): void => {
    navigate(`/form/edit/${id}`, {
      state: { isApproverRequest: true, isFromAllRequest: true },
    });
  };

  const handleDelete = (id: string): void => {
    deleteTechnicalInstruction(id)
      .then(() => {
        loadData({ pagination, sorter });
        notification.success({
          message: "Successfully Deleted",
          description: "Technical Instruction has been deleted.",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Failed to delete",
          description: error.message,
        });
      });
  };

  const showDeleteConfirm = (id: string): void => {
    Modal.confirm({
      title: "Are you sure you want to delete this technical instruction?",
      icon: (
        <FontAwesomeIcon
          icon={faCircleExclamation}
          style={{ marginRight: "10px", marginTop: "5px" }}
        />
      ),
      okText: "Yes",
      cancelText: "No",
      okType: "primary",
      okButtonProps: { className: "btn btn-primary save-btn" },
      cancelButtonProps: { className: "btn-outline-primary no-btn" },
      onOk: () => handleDelete(id),
    });
  };

  const handleExportToExcel = (): void => {
    if (exportRef.current) {
      exportRef.current.openModal();
    }
  };

  // const handleExportToExcelSingle = (id: string, no: string): void => {
  //   setExcelLoading(true);
  //   technicalExcel(id)
  //     .then((data) => {
  //       setExcelLoading(false);
  //       downloadExcelFile(data.ReturnValue, no);
  //       void displayjsx.showSuccess("File downloaded successfully.");
  //     })
  //     .catch((err) => {
  //       setExcelLoading(false);
  //       console.log(err);
  //     });
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

  // const handleRevise = (id: string): void => {
  //   setLoading(true);
  //   technicalReviseList(id)
  //     .then((childData) => {
  //       setLoading(false);
  //       // Merge the child data with the existing data by adding children property
  //       setData((prevData) =>
  //         prevData.map((item) =>
  //           item.TechnicalId === id ? { ...item, children: childData } : item
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //     });
  // };

  const handleExpand = async (expanded: boolean, record: any) => {
    setExpandedRowKeys((prevKeys: any) =>
      expanded
        ? [...prevKeys, record.TechnicalId]
        : prevKeys.filter((key: any) => key !== record.TechnicalId)
    );
    //debugger;
    if (expanded) {
      setLoading(true);
      technicalReviseList(record.TechnicalId)
        .then((childData) => {
          setLoading(false);
          // Merge the child data with the existing data by adding children property
          setData((prevData) =>
            prevData.map((item) =>
              item.TechnicalId === record.TechnicalId
                ? { ...item, ChildData: childData }
                : item
            )
          );
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const handleFetchEmps = () => {
    setReOpenLoading(true);
    //getAllSections(user?.departmentId.toString() ?? "")
    getAllEmployee()
      .then((data) => {
        setReOpenLoading(false);
        let returnData = data.ReturnValue;
        setEmpData(returnData); // Set fetched section data
        setSelectedOwner(null);
        setIsSecondModalVisible(true); // Open the second modal with sections
      })
      .catch((err) => {
        setReOpenLoading(false);
      });
  };

  const showModal = () => setVisible(true);

  const handleFinalSubmit = () => {
    if (comment.length > 1000) {
      void displayjsx.showErrorMsg(
        "Comment length cannot exceed 1000 characters."
      );
      return; // Stop further execution if validation fails
    }
    handleFetchEmps();
  };

  const handleAddRevision = (id: string): void => {
    setSelectedTICId(null);
    setComment("");
    setSelectedTICId(id);
    showModal();
    // debugger;
    // Modal.confirm({
    //   title: "Are you sure you want to revise the request?",
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={faCircleExclamation}
    //       style={{ marginRight: "10px", marginTop: "5px" }}
    //     />
    //   ),
    //   //content: "Please confirm if you want to proceed.",
    //   okText: "Yes",
    //   cancelText: "No",
    //   okType: "primary",
    //   okButtonProps: { className: "btn btn-primary save-btn" },
    //   cancelButtonProps: { className: "btn-outline-primary no-btn" },
    //   onOk: () => {
    //     // setLoading(true);
    //     // technicalReopen(id, user?.employeeId.toString() ?? "")
    //     //   .then((data) => {
    //     //     setLoading(false);
    //     //     void displayjsx.showSuccess("Add revision successfully.");
    //     //     window.location.reload(); // Reload the page after success
    //     //   })
    //     //   .catch((error) => {
    //     //     setLoading(false);
    //     //   });
    //     debugger;
    //     setSelectedTICId(null);
    //     setSelectedTICId(id);
    //     handleFetchEmps();
    //   },
    // });
  };

  // const handleAddRevision = (id: string): void => {
  //   //handleFetchEmps();
  //   debugger;
  //   Modal.confirm({
  //     title: "Are you sure you want to revise the request?",
  //     icon: (
  //       <FontAwesomeIcon
  //         icon={faCircleExclamation}
  //         style={{ marginRight: "10px", marginTop: "5px" }}
  //       />
  //     ),
  //     //content: "Please confirm if you want to proceed.",
  //     okText: "Yes",
  //     cancelText: "No",
  //     okType: "primary",
  //     okButtonProps: { className: "btn btn-primary save-btn" },
  //     cancelButtonProps: { className: "btn-outline-primary no-btn" },
  //     onOk: () => {
  //       // setLoading(true);
  //       // technicalReopen(id, user?.employeeId.toString() ?? "")
  //       //   .then((data) => {
  //       //     setLoading(false);
  //       //     void displayjsx.showSuccess("Add revision successfully.");
  //       //     window.location.reload(); // Reload the page after success
  //       //   })
  //       //   .catch((error) => {
  //       //     setLoading(false);
  //       //   });
  //       debugger;
  //       setSelectedTICId(null);
  //       setSelectedTICId(id);
  //       handleFetchEmps();
  //     },
  //   });
  // };

  const columns: ColumnsType<any> = [
    {
      title: "Request No",
      dataIndex: "CTINumber",
      key: "CTINumber",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("CTINumber", "Request No"),
    },
    {
      //title: "Attachments",
      dataIndex: "HasAttachments",
      key: "HasAttachments",
      width: "1%",
      sorter: false,
      render: (text) => (
        <span>
          {text === 1 ? (
            <FontAwesomeIcon
              title="Attachment Available"
              icon={faPaperclip}
              style={{ color: "green" }}
            />
          ) : (
            <span>&nbsp;&nbsp;&nbsp;</span>
          )}
        </span>
      ),
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY") : ""}</span>
      ),
      ...getColumnSearchProps("IssueDate", "Issue Date"),
    },
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      width: "15%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("Title", "Title"),
    },
    {
      title: "Equipment",
      dataIndex: "EquipmentNames",
      key: "EquipmentNames",
      width: "14%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("EquipmentNames", "Equipment"),
    },
    {
      title: "Requestor",
      dataIndex: "Requestor",
      key: "Requestor",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("Requestor", "Requestor"),
    },
    {
      title: "Current Approver",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) => <span>{text ?? "-"}</span>,
      ...getColumnSearchProps("CurrentApprover", "Current Approver"),
    },
    {
      title: "Target Closure Date",
      dataIndex: "TargetClosureDate",
      key: "TargetClosureDate",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY") : ""}</span>
      ),
      ...getColumnSearchProps("TargetClosureDate", "Closure Date"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: "10%",
      sorter: true,
      ...getColumnSearchProps("Status", "Status"),
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
      className: "text-center",
      key: "action",
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

          {/* <Button
            title="Revise"
            className="action-btn"
            icon={<FontAwesomeIcon title="Revise" icon={faHistory} />}
            onClick={() => handleRevise(record.TechnicalId)}
          /> */}

          {user?.isAdmin && ( // ||
            //record.Status === REQUEST_STATUS.Draft ||
            //record.Status === REQUEST_STATUS.UnderAmendment
            <Button
              title="Edit"
              className="action-btn"
              icon={<FontAwesomeIcon title="Edit" icon={faEdit} />}
              onClick={() => handleEdit(record.TechnicalId)}
            />
          )}

          {/* {record.IsReOpen == false &&
            (user?.isAdmin ||
              record.Status == REQUEST_STATUS.Closed ||
              record.Status == REQUEST_STATUS.Completed ||
              record.Status == REQUEST_STATUS.Approved) && (
              <Button
                title="Export To Excel"
                className="action-btn"
                icon={
                  <FontAwesomeIcon title="Export To Excel" icon={faFileExcel} />
                }
                onClick={() =>
                  handleExportToExcelSingle(
                    record.TechnicalId,
                    record.CTINumber
                  )
                }
              />
            )} */}

          {record.IsReOpen == false && //user?.isAdmin ||
            (record.Status == REQUEST_STATUS.Closed ||
              record.Status == REQUEST_STATUS.Completed ||
              record.Status == REQUEST_STATUS.Approved) && (
              <Button
                title="PDF"
                className="action-btn"
                icon={<FontAwesomeIcon title="PDF" icon={faFilePdf} />}
                onClick={() => handlePdf(record.TechnicalId, record.CTINumber)}
              />
            )}

          {user?.isAdmin &&
            !(
              record.Status == REQUEST_STATUS.Closed ||
              record.Status == REQUEST_STATUS.Approved ||
              record.Status == REQUEST_STATUS.Completed
            ) && (
              <Button
                title="Delete"
                className="action-btn"
                icon={<FontAwesomeIcon title="Delete" icon={faTrash} />}
                onClick={() => showDeleteConfirm(record.TechnicalId)}
              />
            )}

          {record.IsReOpen == false &&
            user?.isAdmin &&
            record.Status == REQUEST_STATUS.Completed && (
              <Button
                title="Add Revision"
                className="action-btn"
                icon={<FontAwesomeIcon title="Add Revision" icon={faRetweet} />}
                onClick={() => handleAddRevision(record.TechnicalId)}
              />
            )}
        </span>
      ),
    },
  ];

  const expandedRowRender = (record: any) => {
    //const technicalId = record.TechnicalId;

    const dataSource: any = record.ChildData || [];
    const nestedColumns: ColumnsType<any> = [
      {
        dataIndex: "CTINumber",
        key: "CTINumber",
        width: "10%",
        render: (text) => <span className="m-0">{text ?? "-"}</span>,
      },
      {
        //title: "Attachments",
        dataIndex: "HasAttachments",
        key: "HasAttachments",
        width: "1%",
        render: (text) => (
          <span>
            {text === 1 ? (
              <FontAwesomeIcon
                title="Attachment Available"
                icon={faPaperclip}
                style={{ color: "green" }}
              />
            ) : (
              <span>&nbsp;&nbsp;&nbsp;</span>
            )}
          </span>
        ),
      },
      {
        dataIndex: "IssueDate",
        key: "IssueDate",
        width: "10%",
        render: (text) => (
          <span className="m-0">
            {text ? dayjs(text).format("DD-MM-YYYY") : "-"}
          </span>
        ),
      },
      {
        dataIndex: "Title",
        key: "Title",
        width: "15%",
        render: (text) => <span className="m-0">{text ?? "-"}</span>,
      },
      {
        dataIndex: "EquipmentNames",
        key: "EquipmentNames",
        width: "14%",
        render: (text) => <span className="m-0">{text ?? "-"}</span>,
      },
      {
        dataIndex: "Requestor",
        key: "Requestor",
        width: "10%",
        render: (text) => <span className="m-0">{text ?? "-"}</span>,
      },
      {
        dataIndex: "CurrentApprover",
        key: "CurrentApprover",
        width: "10%",
        render: (text) => <span className="m-0">{text ?? "-"}</span>,
      },
      {
        dataIndex: "TargetClosureDate",
        key: "TargetClosureDate",
        width: "10%",
        render: (text) => (
          <span className="m-0">
            {text ? dayjs(text).format("DD-MM-YYYY") : "-"}
          </span>
        ),
      },

      {
        dataIndex: "Status",
        key: "Status",
        width: "10%",
        render: (text) => (
          <span
            className={`status-badge status-badge-${
              STATUS_COLOUR_CLASS[text] ?? ""
            }`}
          >
            {text ? displayRequestStatus(text) : "-"}
          </span>
        ),
      },
      {
        key: "action",
        className: "text-center",
        width: "10%",
        render: (_, record) => (
          <span className="action-cell">
            <Button
              style={{ marginLeft: "22px" }}
              title="View"
              className="action-btn"
              icon={<FontAwesomeIcon title="View" icon={faEye} />}
              onClick={() => handleView(record.TechnicalId)}
            />
            <Button
              title="PDF"
              className="action-btn"
              icon={<FontAwesomeIcon title="PDF" icon={faFilePdf} />}
              onClick={() => handlePdf(record.TechnicalId, record.CTINumber)}
            />
          </span>
        ),
        sorter: false,
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

  const handleEmpSelctionFinalSubmit = () => {
    setReOpenLoading(true);
    setVisible(false);
    setIsSecondModalVisible(false);
    changeRequestOwner(
      selectedTICId?.toString() ?? "",
      selectedOwner?.toString() ?? "",
      comment
    )
      .then((data) => {
        setReOpenLoading(false);
        void displayjsx.showSuccess("Add revision successfully.");
        window.location.reload(); // Reload the page after success
      })
      .catch((error) => {
        setReOpenLoading(false);
        setVisible(true);
        setIsSecondModalVisible(true);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3 items-center">
          <div style={{ position: "relative", display: "inline-block" }}>
            <Input
              type="text"
              placeholder="Search Here"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSearchColumn("");
              }}
              style={{ width: "300px" }}
            />
            {searchText && (
              <CloseOutlined
                onClick={() => {
                  setSearchText("");
                  setSearchColumn("");
                }}
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
        <ExportToExcel ref={exportRef} type={"3"} />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          ...pagination,
          showTotal: (total, range) => (
            <div className="d-flex align-items-center gap-3">
              <span style={{ marginRight: "auto" }}>
                Showing {range[0]}-{range[1]} of {total} items
              </span>
            </div>
          ),
        }}
        loading={loading}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          rowExpandable: (record) => record.PlusSign == "1",
          onExpand: handleExpand,
          expandedRowRender: expandedRowRender,
        }}
        onChange={handleTableChange}
        rowKey="TechnicalId"
        scroll={{ x: "max-content", y: "300px" }} // Ensure 'max-content' for dynamic width
        className="no-radius-table dashboard-table"
      />
      <Spin spinning={pdfLoading || reOpenLoading} fullscreen />

      <>
        {/* Employee Modal for selecting sections */}
        <Modal
          //title="Select Section and Section Head"
          open={isSecondModalVisible}
          onCancel={() => setIsSecondModalVisible(false)}
          width={600} //
          style={{ height: "600px", overflowY: "auto" }}
          footer={[
            <Button key="cancel" onClick={() => setIsSecondModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleEmpSelctionFinalSubmit}
              //loading={loading}
              disabled={!selectedOwner} // Disable submit if no section is selected
            >
              Submit
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Select User">
              <Select
                placeholder="Please Select or Serach a User"
                value={selectedOwner}
                onChange={(value: number) => setSelectedOwner(value)} // Set the selected section
                showSearch // Enable search
                filterOption={
                  (input, option: any) =>
                    option?.children &&
                    option.children.toLowerCase().includes(input.toLowerCase()) // Check if option.children exists
                }
                optionFilterProp="children" // Define which property to filter by
                style={{ width: "100%" }}
              >
                {empData.map((emp) => (
                  <Option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {`${emp.EmployeeName} ( ${emp.Email} )`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>

      <>
        {
          <Modal
            title={
              <>
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  style={{ marginRight: "10px", marginTop: "5px" }}
                />
                Are you sure you want to revise the request?
              </>
            }
            maskClosable={false}
            open={visible}
            onCancel={() => setVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setVisible(false)}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleFinalSubmit}
                disabled={comment.trim() === ""} // Disable if comment is empty
              >
                Submit
              </Button>,
            ]}
          >
            <Input.TextArea
              placeholder="Enter Comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ margin: "10px 0px 10px 0px" }}
            />
          </Modal>
        }
      </>

      <Spin spinning={reOpenLoading} fullscreen />
    </div>
  );
};

export default AllRequestsTab;
