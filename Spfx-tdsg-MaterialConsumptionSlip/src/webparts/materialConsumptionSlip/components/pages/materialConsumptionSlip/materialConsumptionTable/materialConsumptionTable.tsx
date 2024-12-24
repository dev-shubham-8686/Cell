import * as React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faFileExport, faFilePdf, faFileExcel, faTrash } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table/interface";
import { AnyObject } from "antd/es/_util/type";

import Table from "../../../table";
import ColumnFilter from "../../../table/columnFilter";
import { DATE_FORMAT, REQUEST_STATUS, STATUS_COLOUR_CLASS } from "../../../../GLOBAL_CONSTANT";
import useExportToExcel from "../../../../apis/exportToExcel/exportMaterialRequest/useExportToExcel";
import { displayRequestStatus } from "../../../../utility/utility";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import usePDFViewer from "../../../../apis/pdfViewer/usePDFViewer";
import { Modal, Spin } from "antd";
import useDeleteMaterialConsumptionSlip from "../../../../apis/materialConsumptionSlip/useDelete/useDelete";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const MaterialConsumptionTable: React.FC = () => {
  const navigate = useNavigate();
  const {mutate:exportToExcel,isLoading:excelLoading}=useExportToExcel()
  const {mutate:pdfDownload,isLoading:pdfLoading}= usePDFViewer()
  const { mutate: deleteMaterialConsumption } = useDeleteMaterialConsumptionSlip();
    const user = useContext(UserContext);

  const handleExportToExcel = (id: any,materialNo:any) => {
    try {
      console.log("MATERIALID",id)
      exportToExcel({id,materialNo})
      console.log("Export to Excel ")
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handlePDF = (id: any , materialNo:any) => {
    try {
      console.log("MATERIALID",id)

      pdfDownload({id,materialNo},{
      onSuccess: (pdfResponse) => {
        
        console.log("PDF Response: ", pdfResponse);
        // window.open(pdfResponse, "_blank");  //this will Open the PDF in a new tab
      },
      
      onError: (error) => {
        console.error("Export error:", error);
      },

    });
      console.log("PDF downloaded ")
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
      cancelText:"No",
      cancelButtonProps: { className: "btn btn-outline-primary" },
      okButtonProps: { className: "btn btn-primary" },
      onOk() {
        deleteMaterialConsumption(id ,{
          onSuccess: (Response) => {
            
            console.log("ATA Response: ", Response);
            window.location.reload();
          },
          
          onError: (error) => {
            console.error("Export error:", error);
          },
    
        })
      },
      // centered: true,
    });
  }
  
  


  const columns: ColumnsType<AnyObject> = [
    {
      title: "Request No",
      dataIndex: "MaterialConsumptionSlipNo",
      key: "MaterialConsumptionSlipNo",
      width: "10%",
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      width: "20%",
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
      width: "15%",
      sorter: true,
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },

    {
      title: "Requested Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: "15%",
      sorter: true,
      render: (text) => (
        <p className="text-cell">{format(text, DATE_FORMAT)}</p>
      ),
      filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Closed Date",
      dataIndex: "ClosedDate",
      key: "ClosedDate",
      width: "15%",
      sorter: true,
      render: (text) => (
        <p className="text-cell">  {text ? format(text, DATE_FORMAT) : "-"}</p>
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
      width: "15%",
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
        <div className="action-cell">
          {console.log("DATAOFMATERIAL", row)}
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/form/view/${row.MaterialConsumptionSlipId}`
              )
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>

          {(user.isAdmin ||
            ((row.Status === REQUEST_STATUS.Draft ||
              row.Status === REQUEST_STATUS.UnderAmendment) &&
              row.CreatedBy == user.employeeId)) && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() =>
                navigate(
                  `/form/edit/${row.MaterialConsumptionSlipId}`
                )
              }
            >
              <FontAwesomeIcon title="Edit" icon={faEdit} />
            </button>
          )}

          {(user.isAdmin ||
            row.Status == REQUEST_STATUS.Closed ||
            row.Status == REQUEST_STATUS.Approved) && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handleExportToExcel(
                  row.MaterialConsumptionSlipId,
                  row.MaterialConsumptionSlipNo
                );
              }}
            >
              <FontAwesomeIcon title="Export To Excel" icon={faFileExcel} />
            </button>
          )}

          {(user.isAdmin ||
            row.Status == REQUEST_STATUS.Closed ||
            row.Status == REQUEST_STATUS.Approved) && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handlePDF(
                  row.MaterialConsumptionSlipId,
                  row.MaterialConsumptionSlipNo
                );
              }}
            >
              <FontAwesomeIcon title="PDF" icon={faFilePdf} />
            </button>
          )}

          {((user.isAdmin && row.Status != REQUEST_STATUS.Closed) ||
            (row.Status == REQUEST_STATUS.Draft &&
              row.CreatedBy == user.employeeId)) && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handleDelete(
                  row.MaterialConsumptionSlipId
                );
              }}
            >
              <FontAwesomeIcon title="Delete" icon={faTrash} />
            </button>
          )}
        </div>
      ),
      sorter: false,
      width: "10%",
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        paginationRequired={true}
        url="/api/Material/Get"
      />
      <Spin spinning={(excelLoading||pdfLoading)} fullscreen />
    </>
  );
};

export default MaterialConsumptionTable;
