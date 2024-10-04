import { Table } from "antd";
import * as React from "react";

const Workflow = () => {
  const dataSource = [
    {
      key: "1",
      ApproverRole: "Approver",
      ReportingManager: "Jane Smith",
      DepartmentHead: "Alice Johnson",
      DeputyDivisionHead: "Bob Brown",
    },
    {
      key: "2",
      ApproverRole: "Process Status",
      ReportingManager: "Approved",
      DepartmentHead: "Under Approval",
      DeputyDivisionHead: "Pending",
    },
    {
      key: "3",
      ApproverRole: "Reviewer Comment",
      ReportingManager: "Looks good.",
      DepartmentHead: "Approved with changes.",
      DeputyDivisionHead: "Excellent work.",
    },
    {
      key: "4",
      ApproverRole: "Action Date",
      ReportingManager: "2023-09-01",
      DepartmentHead: "2023-09-10",
      DeputyDivisionHead: "2023-09-12",
    },
  ];

  const columns = [
    {
      title: "Approver Role",
      dataIndex: "ApproverRole",
      key: "ApproverRole",
      className: "custom-column-bg",
    },
    {
      title: "Reporting manager",
      dataIndex: "ReportingManager",
      key: "ReportingManager",
      onCell: (record: any) => {
        if (record.ApproverRole === "Process Status") {
          return {
            className: `status-cell-${record.ReportingManager.replace(
              /\s+/g,
              ""
            ).toLowerCase()}`,
          };
        }
        return {};
      },
    },
    {
      title: "Department Head",
      dataIndex: "DepartmentHead",
      key: "DepartmentHead",
      onCell: (record: any) => {
        if (record.ApproverRole === "Process Status") {
          return {
            className: `status-cell-${record.DepartmentHead.replace(
              /\s+/g,
              ""
            ).toLowerCase()}`,
          };
        }
        return {};
      },
    },
    {
      title: "Deputy Division Head",
      dataIndex: "DeputyDivisionHead",
      key: "DeputyDivisionHead",
      onCell: (record: any) => {
        if (record.ApproverRole === "Process Status") {
          return {
            className: `status-cell-${record.DeputyDivisionHead.replace(
              /\s+/g,
              ""
            ).toLowerCase()}`,
          };
        }
        return {};
      },
    },
  ];
  return (
    <div className="py-3 history-table">
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        className="workflow-table"
      />
    </div>
  );
};

export default Workflow;
