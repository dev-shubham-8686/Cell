import { SearchOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import React from "react";
import { ColumnsType } from "antd/es/table/interface";
import Table from "../../table/table";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

const EquipmentReportTable: React.FC<{}> = ({}) => {
  const navigate = useNavigate();

  // const handleExportToExcel = (id: any) => {
  //   try {
  //     console.log("MATERIALID",id)
  //     exportToExcel.mutate(id)
  //     console.log("Export to Excel ")
  //   } catch (error) {
  //     console.error("Export error:", error);
  //   }
  // };

  // const handlePDF = (id: any) => {
  //   try {
  //     console.log("MATERIALID",id)

  //     pdfDownload.mutate(id, {
  //     onSuccess: (pdfResponse) => {

  //       console.log("PDF Response: ", pdfResponse);
  //       // window.open(pdfResponse, "_blank");  //this will Open the PDF in a new tab
  //     },

  //     onError: (error) => {
  //       console.error("Export error:", error);
  //     },

  //   });
  //     console.log("PDF downloaded ")
  //   } catch (error) {
  //     console.error("Export error:", error);
  //   }
  // };

  const columns: ColumnsType<AnyObject> = [
    {
      title: "Application No",
      dataIndex: "EquipmentImprovementNo",
      key: "EquipmentImprovementNo",
      width: "20%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Section Name",
      dataIndex: "SectionName",
      key: "SectionName",
      width: "15%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Improvement Name",
      dataIndex: "ImprovementName",
      key: "ImprovementName",
      width: "15%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Machine Name",
      dataIndex: "MachineName",
      key: "MachineName",
      width: "15%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Sub Machine Name",
      dataIndex: "SubMachineName",
      key: "SubMachineName",
      width: "15%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
      width: "15%",
      sorter: true,
      // render: (text) => (
      //   <p className="text-cell">{format(text, DATE_FORMAT)}</p>
      // ),
      // filterDropdown: ColumnFilter,
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      // ),
    },
    {
      title: "Created By",
      dataIndex: "Requestor",
      key: "Requestor",
      width: "15%",
      sorter: true,
      // render: (text) => (
      //   <p className="text-cell">{format(text, DATE_FORMAT)}</p>
      // ),
      // filterDropdown: ColumnFilter,
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      // ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: "15%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
      // render: (text) => (
      //   <span
      //     className={`status-badge status-badge-${
      //       STATUS_COLOUR_CLASS[text] ?? ""
      //     }`}
      //   >
      //     {displayRequestStatus(text)}
      //   </span>
      // ),
    },
    {
      title: <p className="text-center p-0 m-0">Actions</p>,
      key: "action",
      render: (row) => (
        <div className="action-cell">
          {console.log("DATAOFMATERIAL", row)}
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/equipment-improvement-report/form/view/${row.EquipmentImprovementId}`
              )
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>

          {true && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() =>
                navigate(
                  `/equipment-improvement-report/form/edit/${row.EquipmentImprovementId}`
                )
              }
            >
              <FontAwesomeIcon title="Edit" icon={faEdit} />
            </button>
          )}
        </div>
      ),
      sorter: false,
      width: "10%",
    },
  ];
  return (
    <Table
      columns={columns}
      paginationRequired={true}
      url="/api/EquipmentImprovement/EqupimentList"
    />
  );
};

export default EquipmentReportTable;
