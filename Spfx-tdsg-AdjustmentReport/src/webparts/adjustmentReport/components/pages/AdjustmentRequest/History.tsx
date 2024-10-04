import { Table } from "antd";
import * as React from "react";

const History = () => {
  //   Define the data for the table
  const dataSource = [
    {
      key: "1",
      Action: "Approve",
      Comments: "No Need to change",
      ActionTakenBy: "Jane Smith",
      ActionTakenDate: new Date().toLocaleDateString(),
    },
    {
      key: "2",
      Action: "Reject",
      Comments: "Need to change",
      ActionTakenBy: "John Doe",
      ActionTakenDate: new Date().toLocaleDateString(),
    },
    {
      key: "3",
      Action: "Approver",
      Comments: "Need to change",
      ActionTakenBy: "Jane Smith",
      ActionTakenDate: new Date().toLocaleDateString(),
    },
    {
      key: "4",
      Action: "Approver",
      Comments: "Need to change",
      ActionTakenBy: "Jane Smith",
      ActionTakenDate: new Date().toLocaleDateString(),
    },
  ];

  const columns = [
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
    },
    {
      title: "Comments",
      dataIndex: "Comments",
      key: "Comments",
    },

    {
      title: "Action taken By",
      dataIndex: "ActionTakenBy",
      key: "ActionTakenBy",
    },
    {
      title: "Action Taken Date",
      dataIndex: "ActionTakenDate",
      key: "ActionTakenDate",
    },
  ];

  return (
    <div className="py-3 history-table">
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
};

export default History;
