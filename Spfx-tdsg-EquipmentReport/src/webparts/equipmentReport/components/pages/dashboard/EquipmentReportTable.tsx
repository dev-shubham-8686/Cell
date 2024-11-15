import { SearchOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import React, { useContext, useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table/interface";
import Table from "../../table/table";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import {
  faEdit,
  faEye,
  faFileExcel,
  faFilePdf,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  DATE_FORMAT,
  REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
} from "../../../GLOBAL_CONSTANT";
import useDeleteEQReport from "../../../apis/equipmentReport/useDelete/useDeleteEQReport";
import { Modal } from "antd";
import { IUser, UserContext } from "../../../context/userContext";
import ColumnFilter from "../../table/columnFilter/columnFilter";
import { displayRequestStatus } from "../../../utility/utility";
import dayjs from "dayjs";
import usePDFViewer from "../../../apis/pdf/usePDFViewer";

const EquipmentReportTable: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const user: IUser = useContext(UserContext);
  const { mutate: deleteEquipment } = useDeleteEQReport();
  const { mutate: pdfDownload, isLoading: pdfLoading } = usePDFViewer();
  const [refetchKey, setrefetchKey] = useState<number>(0);

  const handlePDF = (id: any, EQReportNo: any) => {
    try {
      console.log("MATERIALID", id);

      pdfDownload(
        { id, EQNo: EQReportNo },
        {
          onSuccess: (pdfResponse) => {
            console.log("PDF Response: ", pdfResponse);
            // window.open(pdfResponse, "_blank");  //this will Open the PDF in a new tab
          },

          onError: (error) => {
            console.error("Export error:", error);
          },
        }
      );
      console.log("PDF downloaded ");
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleDelete = (id: any) => {
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
      cancelText: "No",
      cancelButtonProps: { className: "btn btn-outline-primary" },
      okButtonProps: { className: "btn btn-primary" },
      onOk() {
        deleteEquipment(id, {
          onSuccess: (Response) => {
            console.log("ATA Response: ", Response);
            setrefetchKey((prevKey) => prevKey + 1);
            // window.location.reload();
          },

          onError: (error) => {
            console.error("Export error:", error);
          },
        });
      },
      // centered: true,
    });
  };

  // const columns: ColumnsType<AnyObject> = [
  //   {
  //     title: "Application No",
  //     dataIndex: "EquipmentImprovementNo",
  //     key: "EquipmentImprovementNo",
  //     width: "10%",
  //     sorter: true,
  //     // filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "Issue Date",
  //     dataIndex: "IssueDate",
  //     key: "IssueDate",
  //     width: "10%",
  //     sorter: true,
  //     // render: (text) => (
  //     //   <p className="text-cell">{dayjs(text).format(DATE_FORMAT)}</p>
  //     // ),
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "Machine Name",
  //     dataIndex: "MachineName",
  //     key: "MachineName",
  //     width: "15%",
  //     sorter: true,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "Sub Machine Name",
  //     dataIndex: "SubMachineName",
  //     key: "SubMachineName",
  //     width: "15%",
  //     sorter: true,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "Section Name",
  //     dataIndex: "SectionName",
  //     key: "SectionName",
  //     width: "15%",
  //     sorter: true,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "Improvement Name",
  //     dataIndex: "ImprovementName",
  //     key: "ImprovementName",
  //     width: "15%",
  //     sorter: true,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },

  //   {
  //     title: "Requestor",
  //     dataIndex: "Requestor",
  //     key: "Requestor",
  //     width: "10%",
  //     sorter: true,
  //     render: (text) => <p className="text-cell">{text ?? "-"}</p>,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "CurrentApprover",
  //     dataIndex: "CurrentApprover",
  //     key: "CurrentApprover",
  //     width: "10%",
  //     sorter: true,
  //     render: (text) => <p className="text-cell">{text ?? "-"}</p>,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "Status",
  //     key: "Status",
  //     width: "100",
  //     sorter: true,
  //     filterDropdown: ColumnFilter,
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
  //     ),
  //     render: (text) => (
  //       <span
  //         className={`status-badge status-badge-${
  //           STATUS_COLOUR_CLASS[text] ?? ""
  //         }`}
  //       >
  //         {displayRequestStatus(text)}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: <p className="text-center p-0 m-0">Actions</p>,
  //     key: "action",
  //     render: (row) => (
  //       <div className="action-cell">
  //         {console.log("EQ DATA", row)}
  //         <button
  //           type="button"
  //           style={{ background: "none", border: "none" }}
  //           onClick={() =>
  //             navigate(
  //               `/form/view/${row.EquipmentImprovementId}`
  //             )
  //           }
  //         >
  //           <FontAwesomeIcon title="View" icon={faEye} />
  //         </button>
  //         {console.log(
  //           "Edit",
  //           row.Status,
  //           REQUEST_STATUS.Draft,
  //           row.Requestor,
  //           user.employeeName
  //         )}
  //         {(row.Status == REQUEST_STATUS.LogicalAmendment ||
  //           row.Status == REQUEST_STATUS.UnderImplementation ||
  //           (row.Status == REQUEST_STATUS.ResultMonitoring && !row.IsResultSubmit) ||
  //           row.Status == REQUEST_STATUS.Draft ||
  //           row.Status == REQUEST_STATUS.UnderAmendment ||
  //           row.Status == REQUEST_STATUS.PCRNPending ||
  //           row.Status == REQUEST_STATUS.Approved) &&
  //           row.CreatedBy == user?.employeeId && (
  //             <button
  //               type="button"
  //               style={{ background: "none", border: "none" }}
  //               onClick={() =>
  //                 navigate(
  //                   `/form/edit/${row.EquipmentImprovementId}`
  //                 )
  //               }
  //             >
  //               <FontAwesomeIcon title="Edit" icon={faEdit} />
  //             </button>
  //           )}

  //         {(row.Status==REQUEST_STATUS.Completed ||( row.IsSubmit && row.CurrentApproverId==user?.employeeId && user?.isQcTeamHead)) && (
  //           <button
  //             type="button"
  //             style={{ background: "none", border: "none" }}
  //             onClick={() => {
  //               handlePDF(
  //                 row.EquipmentImprovementId,
  //                 row.EquipmentImprovementNo
  //               );
  //             }}
  //           >
  //             <FontAwesomeIcon title="PDF" icon={faFilePdf} />
  //           </button>
  //         )}

  //         {row.Status == REQUEST_STATUS.Draft &&
  //           row.CreatedBy == user?.employeeId && (
  //             <button
  //               type="button"
  //               style={{ background: "none", border: "none" }}
  //               onClick={() => {
  //                 handleDelete(row.EquipmentImprovementId);
  //               }}
  //             >
  //               <FontAwesomeIcon title="Delete" icon={faTrash} />
  //             </button>
  //           )}
  //       </div>
  //     ),
  //     sorter: false,
  //     width: "10%",
  //   },
  // ];

  const columns: ColumnsType<AnyObject> = [
    {
      title: "Application No",
      dataIndex: "EquipmentImprovementNo",
      key: "EquipmentImprovementNo",
      width: 150,
      sorter: true,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
       width: 150,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Area",
      dataIndex: "Area",
      key: "Area",
       width: 150,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Machine Name",
      dataIndex: "MachineName",
      key: "MachineName",
       width: 200,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Sub Machine Name",
      dataIndex: "SubMachineName",
      key: "SubMachineName",
       width: 200,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
      render: (text) => <p className="text-cell">{text ?? "All"}</p>,
    },
    {
      title: "Section Name",
      dataIndex: "SectionName",
      key: "SectionName",
       width: 200,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Improvement Name",
      dataIndex: "ImprovementName",
      key: "ImprovementName",
       width: 200,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Requestor",
      dataIndex: "Requestor",
      key: "Requestor",
       width: 120,
      sorter: true,
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Current Approver",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
       width: 200,
      sorter: true,
      render: (text) => <p className="text-cell">{text ?? "-"}</p>,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
       width: 170,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
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
      title: <p className="text-center p-0 m-0">Actions</p>,
      key: "action",
      // width: 120,
      render: (row) => (
        <div className="action-cell">
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() => navigate(`/form/view/${row.EquipmentImprovementId}`)}
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>
          {(row.Status === REQUEST_STATUS.LogicalAmendment ||
            row.Status === REQUEST_STATUS.UnderImplementation ||
            (row.Status === REQUEST_STATUS.ResultMonitoring &&
              !row.IsResultSubmit) ||
            row.Status === REQUEST_STATUS.Draft ||
            row.Status === REQUEST_STATUS.UnderAmendment ||
            row.Status === REQUEST_STATUS.PCRNPending ||
            row.Status === REQUEST_STATUS.Approved) &&
            row.CreatedBy == user?.employeeId && (
              <button
                type="button"
                style={{ background: "none", border: "none" }}
                onClick={() =>
                  navigate(`/form/edit/${row.EquipmentImprovementId}`)
                }
              >
                <FontAwesomeIcon title="Edit" icon={faEdit} />
              </button>
            )}
          {row.Status === REQUEST_STATUS.Completed && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handlePDF(
                  row.EquipmentImprovementId,
                  row.EquipmentImprovementNo
                );
              }}
            >
              <FontAwesomeIcon title="PDF" icon={faFilePdf} />
            </button>
          )}
          {row.Status === REQUEST_STATUS.Draft &&
            row.CreatedBy == user?.employeeId && (
              <button
                type="button"
                style={{ background: "none", border: "none" }}
                onClick={() => {
                  handleDelete(row.EquipmentImprovementId);
                }}
              >
                <FontAwesomeIcon title="Delete" icon={faTrash} />
              </button>
            )}
        </div>
      ),
      sorter: false,
    },
  ];

  return (
    <>
      <div>
        <Table
          columns={columns}
          paginationRequired={true}
          url="/api/EquipmentImprovement/MyEquipmentRequest"
          refetchKey={refetchKey}
        />
      </div>
    </>
  );
};

export default EquipmentReportTable;
