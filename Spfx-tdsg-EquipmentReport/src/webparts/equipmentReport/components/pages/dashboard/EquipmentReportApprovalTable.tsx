import React from 'react'
import Table from '../../table/table';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ColumnFilter from '../../table/columnFilter/columnFilter';
import { STATUS_COLOUR_CLASS } from '../../../GLOBAL_CONSTANT';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from "antd/es/table/interface";

const EquipmentReportApprovalTable : React.FC<{ }> = ({ }) => {
  const navigate = useNavigate();

  const columns: ColumnsType<AnyObject> = [
    {
      title: "Application No",
      dataIndex: "EquipmentImprovementNo",
      key: "EquipmentImprovementNo",
      width: "10%",
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
      width: "10%",
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
      title: "Requestor",
      dataIndex: "Requestor",
      key: "Requestor",
      width: "10%",
      sorter: true,
      render: (text) => (
        <p className="text-cell">{text??"-"}</p>
      ),
      // filterDropdown: ColumnFilter,
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      // ),
    },
    {
      title: "CurrentApprover",
      dataIndex: "CurrentApprover",
      key: "CurrentApprover",
      width: "10%",
      sorter: true,
      render: (text) => (
        <p className="text-cell">{text ?? "-"}</p>
      ),
      // filterDropdown: ColumnFilter,
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      // ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: "10%",
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
          {console.log("Approval EQ Data", row)}
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/equipment-improvement-report/form/view/${row.EquipmentImprovementId}`,
                {
                  state: { isApproverRequest: true },
                }
              )
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>
          {false && (
            <button
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() =>
                navigate(
                  `/equipment-improvement-report/form/edit/${row.EquipmentImprovementId}`,
                  {
                    state: { isApproverRequest: true },
                  }
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
    <Table columns={columns} paginationRequired={true} url="/api/EquipmentImprovement/EqupimentApproverList" />
  )
}

export default EquipmentReportApprovalTable
