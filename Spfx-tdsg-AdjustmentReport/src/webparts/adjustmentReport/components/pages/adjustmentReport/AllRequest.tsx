import { SearchOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import React, { useContext, useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table/interface";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { Button, Modal, Spin } from "antd";
import dayjs from "dayjs";
import { IAdjustmentReportInfo } from "../../../interface";
import { useUserContext } from "../../../context/UserContext";
import { useDeleteAdjustmentReport } from "../../../hooks/useDeleteAdjustmentReport";
import { useGetAdjustmentReportPDF } from "../../../hooks/useGetAdjustmentReportPDF";
import { displayRequestStatus } from "../../../utils/utility";
import Table from "../../table/table";
import ColumnFilter from "../../table/columnFilter/columnFilter";

const AllRequest: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: deleteAdjustment } = useDeleteAdjustmentReport();
  const { mutate: pdfDownload, isLoading: pdfLoading } =
    useGetAdjustmentReportPDF();
  const [refetchKey, setrefetchKey] = useState<number>(0);
  const location = useLocation();
  const { currentTabState } = location.state || {};
  console.log("location", location.state);
  const handlePDF = (id: number, AdjustmentReportNo: any) => {
    try {
      pdfDownload(
        { id, AdjustmentReportNo },
        {
          onSuccess: (pdfResponse: any) => {
            console.log("PDF Response: ", pdfResponse);
            // window.open(pdfResponse, "_blank");  //this will Open the PDF in a new tab
          },

          onError: (error: any) => {
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
        deleteAdjustment(id, {
          onSuccess: (Response: any) => {
            console.log("ATA Response: ", Response);
            setrefetchKey((prevKey) => prevKey + 1);
            // window.location.reload();
          },

          onError: (error: any) => {
            console.error("Export error:", error);
          },
        });
      },
      // centered: true,
    });
  };

  const columns: ColumnsType<IAdjustmentReportInfo> = [
    {
      title: "Report No",
      dataIndex: "ReportNo",
      key: "ReportNo",
      width: 160,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
      width: 140,
      sorter: true,
      render: (text) => (
        <p className="text-cell">
          {text ? dayjs(text).format(DATE_FORMAT) : ""}
        </p>
      ),
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },

    {
      title: "Area",
      dataIndex: "AreaName",
      key: "AreaName",
      width: 140,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Machine Name",
      dataIndex: "MachineName",
      key: "MachineName",
      width: 140,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Sub-Machine Name",
      dataIndex: "SubMachineName",
      key: "SubMachineName",
      width: 180,
      sorter: true,
      //   filterDropdown: ColumnFilter,
      //   filterIcon: (filtered: boolean) => (
      //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      //   ),
    },
    {
      title: "Adjustment Done By",
      dataIndex: "Requestor",
      key: "Requestor",
      width: 140,
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Current Approver",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
      width: 160,
      sorter: true,
      render: (text) => (
        <span style={{ display: "flex", justifyContent: "center" }}>
          {text ? text : "-"}
        </span>
      ),
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: 150,
      sorter: true,
      render: (text) => (
        <span
          className={`status-badge status-badge-${
            STATUS_COLOUR_CLASS[text] ?? ""
          }`}
        >
          {displayRequestStatus(text)}
        </span>
      ),
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: <p className=" p-0 m-0">Actions</p>,
      key: "action",
      width: 140,
      sorter: false,
      render: (record) => (
        <div className="">
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(`/form/view/${record.AdjustmentReportId}`, {
                state: { allReq: true, currentTabState: "allrequest-tab" },
              })
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>

          {(user?.isAdmin ||
            ((record.Status === REQUEST_STATUS.Draft ||
              record.Status === REQUEST_STATUS.UnderAmendment) &&
              record.EmployeeId === user?.employeeId) ||
            (record.AdvisorId == user?.employeeId &&
              record.Status == REQUEST_STATUS.InReview)) && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() =>
                navigate(`/form/edit/${record.AdjustmentReportId}`, {
                  state: { allReq: true },
                })
              }
            >
              <FontAwesomeIcon title="Edit" icon={faEdit} />
            </button>
          )}
          {console.log("My Req Data", record)}
          {record.Status === REQUEST_STATUS.Completed && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handlePDF(record.AdjustmentReportId, record.ReportNo);
              }}
            >
              <FontAwesomeIcon title="PDF" icon={faFilePdf} />
            </button>
          )}

          {((user?.isAdmin && record.Status != REQUEST_STATUS.Completed) ||
            (record.Status === REQUEST_STATUS.Draft &&
              record.CreatedBy == user?.employeeId)) && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handleDelete(record.AdjustmentReportId);
              }}
            >
              <FontAwesomeIcon title="Delete" icon={faTrash} />
            </button>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="tab-content">
        <Table
          columns={columns}
          paginationRequired={true}
          url="/api/AdjustmentReport/GetAllAdjustmentData"
          refetchKey={refetchKey}
        />
        <Spin spinning={pdfLoading} fullscreen />
      </div>
    </>
  );
};

export default AllRequest;
