import React, { useContext } from "react";
import Table from "../../table/table";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import ColumnFilter from "../../table/columnFilter/columnFilter";
import {
  DATE_FORMAT,
  REQUEST_STATUS,
  STATUS_COLOUR_CLASS,
} from "../../../GLOBAL_CONSTANT";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table/interface";
import { displayRequestStatus } from "../../../utility/utility";
import { IUser, UserContext } from "../../../context/userContext";
import usePDFViewer from "../../../apis/pdf/usePDFViewer";
import dayjs from "dayjs";
import { Spin } from "antd";

const EquipmentReportApprovalTable: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const { mutate: pdfDownload, isLoading: pdfLoading } = usePDFViewer();
  const user: IUser = useContext(UserContext);

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
  const columns: ColumnsType<AnyObject> = [
    {
      title: "Application No",
      dataIndex: "EquipmentImprovementNo",
      key: "EquipmentImprovementNo",
      width: 160,
      sorter: true,
      filterDropdown: ColumnFilter,
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
      // render: (text) => (
      //   <p className="text-cell">{format(text, DATE_FORMAT)}</p>
      // ),
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
      render: (text) => (
        <p className="text-cell">
          {text ? dayjs(text, DATE_FORMAT).format(DATE_FORMAT) : "-"}
        </p>
      ),
    },
    {
      title: "Area",
      dataIndex: "Area",
      key: "Area",
      width: 150,
      sorter: true,
      //filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
     {
          title: "Improvement Category",
          dataIndex: "ImprovementCategory",
          key: "ImprovementCategory",
          width: 200,
          sorter: true,
          // filterDropdown: ColumnFilter,
          filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
          ),
          render: (text) => {
            return <p className="text-cell">{text??"-"}</p>;
          },
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
      render: (text) => {
        return <p className="text-cell">{text}</p>;
      },
    },
    {
      title: "Sub Machine Name",
      dataIndex: "SubMachineName",
      key: "SubMachineName",
      width: 200,
      sorter: true,
      //filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
      render: (text) => {
        return <p className="text-cell">{text}</p>;
      },
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
    // {
    //   title: "Approval Status",
    //   dataIndex: "ApproverTaskStatus",
    //   key: "ApproverTaskStatus",
    //  width: "10%",
    //   sorter: true,
    //   filterDropdown: ColumnFilter,
    //   filterIcon: (filtered: boolean) => (
    //     <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
    //   ),
    //   render: (text) => (
    //     <span
    //       className={`status-badge status-badge-${
    //         STATUS_COLOUR_CLASS[text] ?? ""
    //       }`}
    //     >
    //       {displayRequestStatus(text)}
    //     </span>
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: 230,
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
      render: (row) => (
        <div className="">
          {console.log("Approval EQ Data", row)}
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(`/form/view/${row.EquipmentImprovementId}`, {
                state: { isApproverRequest: true },
              })
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>
          {
            // row.IsSubmit &&
            (
              (user?.isQcTeamHead &&
              (row.ApproverTaskStatus == REQUEST_STATUS.InReview ||
                row.ApproverTaskStatus ==
                  REQUEST_STATUS.UnderToshibaApproval))
                   ||
              row.Status == REQUEST_STATUS.Completed
               ||
              (user?.employeeId == row.AdvisorId &&
                row.ApproverTaskStatus == REQUEST_STATUS.InReview)
              ) && (
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
            )
          }
        </div>
      ),
      sorter: false,
      width: 150,
    },
  ];

  return (
    <>
    <Table
      columns={columns}
      paginationRequired={true}
      url="/api/EquipmentImprovement/EqupimentApproverList"
    />
         <Spin spinning={pdfLoading} fullscreen />

    </>
  );
};

export default EquipmentReportApprovalTable;
