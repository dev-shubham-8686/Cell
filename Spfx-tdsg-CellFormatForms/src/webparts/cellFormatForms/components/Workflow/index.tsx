import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IStatus } from "../TroubleReport/RequestSection";
import { displayRequestStatus } from "../utils/utility";
// import { DATE_FORMAT } from "../GLOBAL_CONSTANT";

export interface DataType {
  key?: string;
  role: string;
  approver: string;
  processStatus: IStatus;
  reviewerComments: string;
  date: string;
}

const ApproverTaskList: DataType[] = [
  {
    role: "Trouble Report Raiser",
    approver: "A",
    processStatus: "Pending",
    reviewerComments: "Some comments 1",
    date: "12/12/2024 12:30:40",
  },
  {
    role: "Work Done By",
    approver: "Bcds",
    processStatus: "Pending",
    reviewerComments: "Some comments 2",
    date: "12/12/2024 12:30:40",
  },
  {
    role: "Section in-charge",
    approver: "c",
    processStatus: "Approved",
    reviewerComments: "Some comments 3",
    date: "12/12/2024 12:30:40",
  },
  {
    role: "Department Head/QC",
    approver: "c",
    processStatus: "Approved",
    reviewerComments: "Some comments 4",
    date: "12/12/2024 12:30:40",
  },
  {
    role: "Department Head/QC - Final",
    approver: "c",
    processStatus: "Approved",
    reviewerComments: "Some comments 5",
    date: "12/12/2024 12:30:40",
  },
  // {
  //   role: "Team Comments",
  //   approver: "d",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
  // {
  //   role: "Team Comments",
  //   approver: "d",
  //   processStatus: "Approved",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
  // {
  //   role: "Team Comments",
  //   approver: "d1",
  //   processStatus: "Rejected",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
  // {
  //   role: "Team Comments",
  //   approver: "d2",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
  // {
  //   role: "Team Comments",
  //   approver: "d3",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
  // {
  //   role: "Team Comments",
  //   approver: "d4",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
  // {
  //   role: "Team Comments",
  //   approver: "d5",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },

  // {
  //   role: "Team Comments",
  //   approver: "d6",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },

  // {
  //   role: "Team Comments",
  //   approver: "d7",
  //   processStatus: "Under-Amendment",
  //   reviewerComments: "Some comments 4",
  //   date: "12/12/2024 12:30:40",
  // },
];

const Workflow: React.FC = () => {
  dayjs.extend(customParseFormat);

  // Rows for the workflow table
  const workflowTableBody: {
    head: string;
    cellValues: string[];
    cellColourClass?: string[];
  }[] = [
    {
      head: "Aprover",
      cellValues: ApproverTaskList?.map((item) => item.approver) ?? [],
    },
    {
      head: "Process Status",
      cellValues:
        ApproverTaskList?.map((item) =>
          displayRequestStatus(item.processStatus)
        ) ?? [],
      cellColourClass:
        ApproverTaskList?.map((item) => `status-cell-${item.processStatus}`) ??
        [],
    },
    {
      head: "Reviewer Comments",
      cellValues: ApproverTaskList?.map((item) => item.reviewerComments) ?? [],
    },
    // {
    //   head: "Date",
    //   cellValues:
    //     ApproverTaskList?.map((item) =>
    //       dayjs(item.date, DATE_FORMAT).format(DATE_FORMAT)
    //     ) ?? [],
    // },
  ];

  return (
    <div className="tab-section">
      <div className="table-responsive pb-2">
        <table className="workflow-table">
          <thead>
            <tr>
              <th>Approver Role</th>
              {ApproverTaskList.length > 0 &&
                ApproverTaskList.map((item, index) => (
                  <th key={index}> {item.role}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {workflowTableBody.map((row, index: number) => {
              return (
                <tr key={index}>
                  <th>{row.head}</th>
                  {row.cellValues?.length > 0 &&
                    row.cellValues.map((cellValue, index) => (
                      <td
                        key={index}
                        className={`${
                          row?.cellColourClass?.length > 0
                            ? row.cellColourClass[index]
                            : ""
                        }`}
                      >
                        {cellValue}
                      </td>
                    ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Workflow;
