import React from 'react'
import Table from '../table/table';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ColumnFilter from '../table/columnFilter/columnFilter';
import { STATUS_COLOUR_CLASS } from '../../GLOBAL_CONSTANT';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from "antd/es/table/interface";

const EquipmentReportApprovalTable : React.FC<{ }> = ({ }) => {
  const navigate = useNavigate();

  const columns: ColumnsType<AnyObject> = [
    {
      title: "Request No",
      dataIndex: "MaterialConsumptionSlipNo",
      key: "MaterialConsumptionSlipNo",
      width: "20%",
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
      width: "15%",
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
      title: "When Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      width: "15%",
      sorter: true,
      // render: (text) => (
      //   <p className="text-cell">{format(text, DATE_FORMAT)}</p>
      // ),
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
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/material-consumption-slip/view/${row.MaterialConsumptionSlipId}`, {
                  state: { isApproverRequest: true },
                }
              )
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>

          {/* <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/material-consumption-slip/edit/${row.MaterialConsumptionSlipId}`
              )
            }
          >
            <FontAwesomeIcon title="Edit" icon={faEdit} />
          </button> */}
        </div>
      ),
      sorter: false,
      width: "10%",
    },
  ];
  
  return (
    <Table columns={columns} paginationRequired={true} url="/api/Material/GetApprovalList" />
  )
}

export default EquipmentReportApprovalTable
