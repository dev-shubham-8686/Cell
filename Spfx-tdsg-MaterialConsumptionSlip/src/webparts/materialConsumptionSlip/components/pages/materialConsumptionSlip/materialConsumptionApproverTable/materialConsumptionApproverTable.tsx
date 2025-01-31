import * as React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table/interface";
import { AnyObject } from "antd/es/_util/type";

import Table from "../../../table";
import ColumnFilter from "../../../table/columnFilter";
import { DATE_FORMAT, REQUEST_STATUS, STATUS_COLOUR_CLASS } from "../../../../GLOBAL_CONSTANT";
import { displayRequestStatus } from "../../../../utility/utility";
import dayjs from "dayjs";

const MaterialConsumptionApproverTable: React.FC = () => {
  const navigate = useNavigate();

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
        <div className="">
          <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/form/view/${row.MaterialConsumptionSlipId}`, {
                  state: { isApproverRequest: true },
                }
              )
            }
          >
            <FontAwesomeIcon title="View" icon={faEye} />
          </button>

         {(row.ApproverTaskStatus==REQUEST_STATUS.InReview && (row.seqNumber==1||row.seqNumber==2)) && <button
            type="button"
            style={{ background: "none", border: "none" }}
            onClick={() =>
              navigate(
                `/form/edit/${row.MaterialConsumptionSlipId}`, {
                  state: { isApproverRequest: true },
                }
              )
            }
          >
            <FontAwesomeIcon title="Edit" icon={faEdit} />
          </button>}
        </div>
      ),
      sorter: false,
      width: "10%",
    },
  ];

  return <Table columns={columns} paginationRequired={true} url="/api/Material/GetApprovalList" />;
};

export default MaterialConsumptionApproverTable;
