import { SearchOutlined } from '@ant-design/icons';
import { AnyObject } from 'antd/es/_util/type';
import React from 'react'
import { ColumnsType } from "antd/es/table/interface";
import Table from '../table/table';

const EquipmentReportTable : React.FC<{ }> = ({ }) => {


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
      title: "Request No",
      dataIndex: "MaterialConsumptionSlipNo",
      key: "MaterialConsumptionSlipNo",
      width: "20%",
      sorter: true,
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      width: "15%",
      sorter: true,
      // filterDropdown: ColumnFilter,
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
      // filterDropdown: ColumnFilter,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
    },

    {
      title: "When Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
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
      // render: (row) => (
      //   <div className="action-cell">
      //     {console.log("DATAOFMATERIAL", row)}
      //     <button
      //       type="button"
      //       style={{ background: "none", border: "none" }}
      //       onClick={() =>
      //         navigate(
      //           `/material-consumption-slip/view/${row.MaterialConsumptionSlipId}`
      //         )
      //       }
      //     >
      //       <FontAwesomeIcon title="View" icon={faEye} />
      //     </button>

      //     {(user.isAdmin ||
      //       ((row.Status === REQUEST_STATUS.Draft ||
      //         row.Status === REQUEST_STATUS.UnderAmendment) &&
      //         row.CreatedBy == user.employeeId)) && (
      //       <button
      //         type="button"
      //         style={{ background: "none", border: "none" }}
      //         onClick={() =>
      //           navigate(
      //             `/material-consumption-slip/edit/${row.MaterialConsumptionSlipId}`
      //           )
      //         }
      //       >
      //         <FontAwesomeIcon title="Edit" icon={faEdit} />
      //       </button>
      //     )}

      //     {(user.isAdmin ||
      //       row.Status == REQUEST_STATUS.Closed ||
      //       row.Status == REQUEST_STATUS.Completed) && (
      //       <button
      //         type="button"
      //         style={{ background: "none", border: "none" }}
      //         onClick={() => {
      //           handleExportToExcel(row.MaterialConsumptionSlipId);
      //         }}
      //       >
      //         <FontAwesomeIcon title="Export To Excel" icon={faFileExcel} />
      //       </button>
      //     )}

      //     {(user.isAdmin ||
      //       row.Status == REQUEST_STATUS.Closed ||
      //       row.Status == REQUEST_STATUS.Completed) && (
      //       <button
      //         type="button"
      //         style={{ background: "none", border: "none" }}
      //         onClick={() => {
      //           handlePDF(row.MaterialConsumptionSlipId);
      //         }}
      //       >
      //         <FontAwesomeIcon title="PDF" icon={faFilePdf} />
      //       </button>
      //     )}
      //   </div>
      // ),
      sorter: false,
      width: "10%",
    },
  ];
  return (
    
<Table columns={columns} paginationRequired={true} url="/api/Material/Get" />   
  )
}

export default EquipmentReportTable
