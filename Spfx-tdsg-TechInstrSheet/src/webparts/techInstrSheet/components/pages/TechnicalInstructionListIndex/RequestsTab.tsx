import * as React from "react";
import { Table, Button, Input, notification, Spin } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  deleteTechnicalInstruction,
  technicalPDF,
  // technicalExcel,
  fetchTechnicalInstructionsUpdate,
  technicalReviseList,
  technicalReopen,
  notifyCellDivPart,
} from "../../../api/technicalInstructionApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faEdit,
  faEnvelope,
  faEye,
  //faFileExcel,
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
import {
  DOCUMENT_LIBRARIES,
  EmailListOfNotifyCellDiv,
  REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
  WEB_URL,
} from "../../../GLOBAL_CONSTANT";
import {
  convertBase64ToFile,
  displayRequestStatus,
  // downloadExcelFile,
  downloadPDF,
  generateUniqueFileNameWitCtiNumber,
} from "../../../api/utility/utility";
import { UserContext } from "../../../context/userContext";
import ExportToExcel from "../../common/ExportToExcel";
import displayjsx from "../../../utils/displayjsx";
import { checkAndCreateFolder, uploadFile } from "../../../api/fileUploadApi";
import { WebPartContext } from "../../../context/WebPartContext";

const RequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  // const [excelLoading, setExcelLoading] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(false);
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
  const loadData = React.useCallback((params: any) => {
    setLoading(true);
    fetchTechnicalInstructionsUpdate({
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

  const [isNotifyModalVisible, setIsNotifyModalVisible] = React.useState(false);
  // const [emailContent, setEmailContent] = React.useState("");
  const [mailTriggerTechnicalId, setMailTriggerTechnicalId] =
    React.useState("");
  const [mailTriggerCtinumber, setMailTriggerCtinumber] = React.useState("");
  const [mailLoading, setMailLoading] = React.useState(false);
  const webPartContext = React.useContext(WebPartContext);
  const [visible, setVisible] = React.useState(false);
  const [revisonLoading, setRevisonLoading] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [revTecId, setRevTecId] = React.useState("");

  const showNotifyModal = (technicalId: string, ctiNumber: string) => {
    // Open the modal and save the current request details
    // setEmailContent("");
    setMailTriggerTechnicalId("");
    setMailTriggerCtinumber("");

    setIsNotifyModalVisible(true);
    setMailTriggerTechnicalId(technicalId);
    setMailTriggerCtinumber(ctiNumber);
  };

  const handleSendEmail = () => {
    setMailLoading(true);
    // Construct the mailto link with content and PDF attachment

    notifyCellDivPart(mailTriggerTechnicalId)
      .then(async (response) => {
        setMailLoading(false);
        //const emailList = response.ReturnValue.emails; // Comma-separated emails
        const emailList = EmailListOfNotifyCellDiv;
        const pdfBase64 = response.ReturnValue.pdf; // Base64 string of PDF
        const subject = `Release of ${mailTriggerCtinumber}`;
        let pdf_url_link = "";
        //debugger;

        if (pdfBase64) {
          const isValidFolderOutline = await checkAndCreateFolder(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            mailTriggerCtinumber,
            DOCUMENT_LIBRARIES.Technical_Attchment__NotificationPdf_Attachment
          );

          console.log(isValidFolderOutline);

          const file = convertBase64ToFile(pdfBase64, "application/pdf");

          const fileName =
            generateUniqueFileNameWitCtiNumber(mailTriggerCtinumber);

          const uploaded = await uploadFile(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            mailTriggerCtinumber,
            file,
            fileName,
            DOCUMENT_LIBRARIES.Technical_Attchment__NotificationPdf_Attachment
          );

          if (uploaded) {
            pdf_url_link = `${WEB_URL}/${DOCUMENT_LIBRARIES.Technical_Attachment}/${mailTriggerCtinumber}/${DOCUMENT_LIBRARIES.Technical_Attchment__NotificationPdf_Attachment}/${fileName}`;
            console.log("File uploaded successfully");
          } else {
            console.log("Error uploading file");
          }
        }

        if (emailList) {
          // `emailContent` holds text area input from the modal
          const bodyContent = `\n\nAttached PDF:\n${pdf_url_link}`;

          // Properly encode subject and body for the mailto link
          const encodedSubject = encodeURIComponent(subject);
          const encodedBody = encodeURIComponent(bodyContent);

          const mailtoLink = `mailto:?cc=${emailList}&subject=${encodedSubject}&body=${encodedBody}`;

          window.location.href = mailtoLink; // Opens Outlook or default mail client
        }
      })
      .catch((e) => {
        setMailLoading(false);
        void displayjsx.showErrorMsg("Error fetching data");
      });

    setIsNotifyModalVisible(false);
  };

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
  const getColumnSearchProps = (dataIndex: string, placeholderString:string) => ({
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
    navigate(`/form/view/${id}`, { state: { isApproverRequest: false } });
  };

  const handleEdit = (id: string): void => {
    navigate(`/form/edit/${id}`, { state: { isApproverRequest: false } });
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
  
  const showModal = () => setVisible(true);

  const handleAddRevision = (id: string): void => {
    setComment("");
    setRevTecId("");
    setRevTecId(id);
    showModal();
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
    //     setLoading(true);
    //     technicalReopen(id, user?.employeeId.toString() ?? "")
    //       .then((data) => {
    //         setLoading(false);
    //         void displayjsx.showSuccess("Add revision successfully.");
    //         window.location.reload(); // Reload the page after success
    //       })
    //       .catch((error) => {
    //         setLoading(false);
    //       });
    //   },
    // });
  };

  const handleFinalSubmit = async () => {
    if (comment.length > 1000) {
      void displayjsx.showErrorMsg("Comment length cannot exceed 1000 characters.");
      return; // Stop further execution if validation fails
    }
    setRevisonLoading(true);
    setVisible(false);
    try {
      await technicalReopen(revTecId, user?.employeeId.toString() ?? "", comment);
      void displayjsx.showSuccess("Revision added successfully.");
      window.location.reload(); // Reload the page after success
    } catch (error) {
      setRevisonLoading(false);
      setVisible(true);
    }finally{
      setRevisonLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Request No",
      dataIndex: "CTINumber",
      key: "CTINumber",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("CTINumber","Request No"),
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

          {
            //user?.isAdmin ||
            (record.Status === REQUEST_STATUS.Draft ||
              record.Status === REQUEST_STATUS.UnderAmendment) &&
              record.CreatedBy == user?.employeeId && (
                <Button
                  title="Edit"
                  className="action-btn"
                  icon={<FontAwesomeIcon title="Edit" icon={faEdit} />}
                  onClick={() => handleEdit(record.TechnicalId)}
                />
              )
          }

          {/* {record.IsReOpen == false && //user?.isAdmin ||
            (record.Status == REQUEST_STATUS.Closed ||
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

          {
            //user?.isAdmin ||
            record.Status == REQUEST_STATUS.Draft &&
              record.CreatedBy == user?.employeeId && (
                <Button
                  title="Delete"
                  className="action-btn"
                  icon={<FontAwesomeIcon title="Delete" icon={faTrash} />}
                  onClick={() => showDeleteConfirm(record.TechnicalId)}
                />
              )
          }

          {
            //user?.isAdmin ||
            record.Status == REQUEST_STATUS.Completed &&
              record.CreatedBy == user?.employeeId && (
                <Button
                  title="Add Revision"
                  className="action-btn"
                  icon={
                    <FontAwesomeIcon title="Add Revision" icon={faRetweet} />
                  }
                  onClick={() => handleAddRevision(record.TechnicalId)}
                />
              )
          }

          {/* Notify Cell Division Button */}
          {record.CreatedBy == user?.employeeId &&
            record.Status == REQUEST_STATUS.Completed && (
              <Button
                title="Notify Cell Division"
                className="action-btn"
                icon={
                  <FontAwesomeIcon
                    title="Notify Cell Division"
                    icon={faEnvelope}
                  />
                }
                onClick={() =>
                  showNotifyModal(record.TechnicalId, record.CTINumber)
                }
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

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3 items-center">
          <div style={{ position: "relative", display: "inline-block" }}>
            <Input
              type="text"
              placeholder="Search Here"
              value={searchText}
              onChange={(e) => {setSearchText(e.target.value); setSearchColumn("");}}
              style={{ width: "300px" }}
            />
            {searchText && (
              <CloseOutlined
                onClick={() => {setSearchText(""); setSearchColumn(""); }}
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
        <ExportToExcel ref={exportRef} type={"1"} />
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
        scroll={{ x: 'max-content', y: '300px' }} // Ensure 'max-content' for dynamic width
        className="no-radius-table dashboard-table"
      />
      <Spin spinning={pdfLoading || mailLoading || revisonLoading} fullscreen />

      {
        <Modal
          title="Confirm Notification"
          open={isNotifyModalVisible}
          onCancel={() => setIsNotifyModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsNotifyModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={handleSendEmail} // Assuming this function sends the email
            >
              Send
            </Button>,
          ]}
        >
          <p>Are you sure you want to notify the Cell Division?</p>
        </Modal>
      }

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
          style={{margin:"10px 0px 10px 0px"}}
        />
      </Modal>
      }
    </div>
  );
};

export default RequestsTab;
