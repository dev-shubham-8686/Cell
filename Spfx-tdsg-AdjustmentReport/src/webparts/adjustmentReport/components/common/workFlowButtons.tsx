import { useState } from "react";
import { Button, Modal, Input, Form, Select, Row, Col, Radio, Spin } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useUserContext } from "../../context/UserContext";
import { useGetAllAdvisors } from "../../hooks/useGetAllAdvisors";
import { useGetAdditionalDepartmentHeads } from "../../hooks/useGetAdditionalDepartmentHeads";
import {
  IAdditionalDepartmentHeads,
  IApproveAskToAmendPayload,
} from "../../api/UpdateApproveAskToAmend.api";
import { useUpdateApproveAskToAmend } from "../../hooks/useUpdateApproveAskToAmend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ACTION_TYPE, LEVELS, REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import { IPullBack } from "../../api/PullBack.api";
import { usePullBack } from "../../hooks/usePullBack";
import { useGetCellDepartmentsById } from "../../hooks/useGetCellDepartmentById";
import { showErrorMsg } from "../../utils/displayjsx";
import { IDelegate } from "../../api/DeligateUser.api";
import { useGetAllEmployees } from "../../hooks/useGetAllEmployees";
import { useDelegate } from "../../hooks/useDelegate";

const { Option } = Select;

interface WorkFlowButtonsProps {
  currentApproverTask: any;
  existingAdjustmentReport: any;
  isFormModified: boolean;
  departmentHead: boolean;
  depDivHead?: boolean;
}

const WorkFlowButtons: React.FC<WorkFlowButtonsProps> = ({
  currentApproverTask,
  existingAdjustmentReport,
  isFormModified,
  departmentHead,
  depDivHead,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest,allReq } = location.state || {};
  const [approverRequest, setApproverRequest] =
    React.useState(isApproverRequest);
  const [showWorkflowBtns, setShowWorkflowBtns] =
    React.useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useUserContext();
  const { id, mode } = useParams();
  const { mutate: approveAskToAmend ,isLoading:approving } = useUpdateApproveAskToAmend();
  const { mutate: pullback , isLoading:pullingBack } = usePullBack();
  const { mutate: delegate , isLoading:deligating } = useDelegate();
  const { data: advisors = [] } = useGetAllAdvisors();
    const { data: employeesResult } = useGetAllEmployees();

  const { data: departmentHeads } = useGetAdditionalDepartmentHeads(
    user?.departmentId ?? 0
  );
  const { data: cellDepartments } = useGetCellDepartmentsById(
    user?.departmentId ?? 0
  );

  console.log({ departmentHeads });
  const [isApprovalSectionVisible, setApprovalSectionVisible] = useState(false);
  const [isDivHeadRequired, setisDivHeadRequired] = useState(false);
console.log("ALLREQUEST",allReq)
  React.useEffect(() => {
    // Check if this is an approver request based on the `isApproverRequest` variable
    if (isApproverRequest) {
      setApproverRequest(true); // Set the approver request state to true
    }

    // Get URL parameters from the current window location
    const params = new URLSearchParams(window.location.search);
    const actionValue = params.get("action"); // Extract the `action` parameter value

    // If `action` parameter exists in the URL, proceed with parameter removal and navigation
    if (actionValue) {
      // Remove specified Outlook parameters that are no longer needed
      params.delete("action");
      params.delete("CT");
      params.delete("OR");
      params.delete("CID");

      // Update component state to indicate this is an approver request
      if(!allReq){
      setApproverRequest(true);
      }

      // Use `navigate` to replace the URL with the cleaned parameters, and set tab state
      navigate(location.pathname, {
        state: {
          currentTabState: allReq?"allrequest-tab":"myapproval-tab",
        },
        replace: true, // Replace history to avoid re-adding these parameters on back navigation
      });
    }
  }, []); // Empty dependency array to run only on component mount

  React.useEffect(() => {
    setShowWorkflowBtns(
      currentApproverTask?.approverTaskId &&
        currentApproverTask?.approverTaskId !== 0
    );
  }, [currentApproverTask]);

  const handleCancel = () => {
    // Reset or close the approval section
    setApprovalSectionVisible(false);
    form.resetFields();
  };

  // Handle opening the modal for comment input
  const handleClick = (type: string) => {
    setActionType(type);
    setIsModalVisible(true);
  };

  const handleApprove = async (
    comment: string,
    approvalSequence?: any
  ): Promise<void> => {
    
    if (isApprovalSectionVisible && approvalSequence?.length == 0) {
      void showErrorMsg("Please Select Additional Approvals");
      setApprovalSectionVisible(false);
      return;
    }
    const updatedApprovalSequence = approvalSequence?.map(
      (sequenceItem: any, index: number) => {
        const employee = departmentHeads.find(
          (head) => head.EmployeeId == sequenceItem.EmployeeId
        );
        
        
        return {
          ...sequenceItem,
          DepartmentId: employee?.DepartmentId || null, // Add DepartmentId or null if not found
          ApprovalSequence: index + 1,
        };
      }
    );

    const data: IApproveAskToAmendPayload = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.employeeId ? user?.employeeId : 0,
      Type: 1, //Approved
      Comment: comment,
      AdjustmentId: id ? parseInt(id) : 0,
      AdditionalDepartmentHeads:
        updatedApprovalSequence as IAdditionalDepartmentHeads[],
      IsDivHeadRequired: form.getFieldValue("DivisionHeadApprovalRequired"),
    };

    console.log("Approve a to a payload ", data);
    approveAskToAmend(data, {
      onSuccess: () => {
        navigate("/", {
          state: {
            currentTabState: "myapproval-tab",
          },
        });
      },
    });
  };
  const handleAskToAmend = async (comment: string): Promise<void> => {
    const data: IApproveAskToAmendPayload = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.employeeId ? user?.employeeId : 0,
      Type: 3, //AskToAmend
      Comment: comment,
      AdjustmentId: id ? parseInt(id, 10) : 0,
    };

    approveAskToAmend(data, {
      onSuccess: () => {
        navigate("/", {
          state: {
            currentTabState: "myapproval-tab",
          },
        });
      },
    });
  };

  const handlePullBack = async (comment: string): Promise<void> => {
    const data: IPullBack = {
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      userId: user?.employeeId ? user?.employeeId : 0,
      comment: comment,
    };

    pullback(data, {
      onSuccess: (data) => {
        navigate("/");
      },
    });
  };

  const handleDeligate = async (comment: string , deligateUserId:number): Promise<void> => {
    const data: IDelegate = {
      FormId: id ? parseInt(id, 10) : 0,
      UserId:deligateUserId,
      DelegateUserId: user?.employeeId ? user?.employeeId : 0,
      ApproverTaskId:currentApproverTask?.approverTaskId,
      Comments: comment,
    };
    delegate(data, {
      onSuccess: (data:any) => {
        navigate("/");
      },
    });
  }
  // Handle the submit action after getting the comment
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue(); // Validate form fields
      setLoading(true);

      const comment = values.comment; // Get the validated comment
if(actionType==="delegate"){
  await handleDeligate(comment, values.DeligateUserId)
}
      if (actionType === "approve") {
        await handleApprove(comment, values.approvalSequence);
      } else if (actionType === "amend") {
        await handleAskToAmend(comment);
      } else if (actionType === "pullback") {
        await handlePullBack(comment);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
      throw errorInfo;
    } finally {
      setLoading(false);
    }
  };

  // Determine the modal okText based on action type
  const getOkText = () => {
    if (actionType === "approve") return "Approve";
    if (actionType === "amend") return "Ask to Amend";
    if (actionType === "pullback") return "Pull Back";
    return "Submit"; // Fallback
  };

  return (
    <>
      {/* Action Buttons */}
      {console.log("approval data", showWorkflowBtns, approverRequest)}{" "}
      {showWorkflowBtns && approverRequest ? (
        <>
          <Button
            className="btn btn-primary"
            onClick={() => {
              handleClick("approve");
            }}
            style={{ marginRight: "10px", marginBottom: "50px" }}
          >
            Approve
          </Button>

          <Button
            className="btn btn-primary"
            onClick={() => {
              handleClick("amend");
            }}
            style={{ marginRight: "10px", marginBottom: "50px" }}
          >
            Ask to Amend
          </Button>
        </>
      ) : null}

{user?.isAdmin ? (
  <div className="button-container">
        <Button
          className="btn btn-primary"
          onClick={() => handleClick("delegate")}
        >
          Delegate
        </Button>
        </div>
      ) : (<></>)}

      {existingAdjustmentReport?.IsSubmit &&
      (existingAdjustmentReport?.Status !== REQUEST_STATUS.UnderAmendment &&
        existingAdjustmentReport?.Status !== REQUEST_STATUS.Completed) &&
      user?.employeeId === existingAdjustmentReport?.CreatedBy ? (
        <Button
          className="btn btn-primary"
          onClick={() => handleClick("pullback")}
        >
          Pull Back
        </Button>
      ) : null}
      {/* Comment Modal */}
      {console.log("IsModalVisible", isModalVisible)}{" "}
      <Modal
        open={isModalVisible}
        onCancel={() => {
          form.resetFields(); // Reset all fields --  for removing comments
          handleCancel();
          setIsModalVisible(false);
        }}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={getOkText()} // Dynamic okText based on action type
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ approvalSequence: [] }}
        >
          {/* Conditional Approval Section */}
          {isApprovalSectionVisible && <></>}
          {departmentHead && currentApproverTask?.seqNumber==LEVELS.Level3&& actionType == ACTION_TYPE.Approve && (
            <>
              <Form.Item
                label="Additional Approval Required?"
                name={"AdditionalApprovalRequired"}
              >
                <Radio.Group
                  onChange={(e) =>{
                    const isYesSelected = e.target.value === "yes";
                    setApprovalSectionVisible(e.target.value === "yes")
                    if (isYesSelected) {
                      form.setFieldsValue({
                        approvalSequence: [{ EmployeeId: null, DepartmentId: null }],
                      });
                    } else {
                      form.resetFields(); // Reset all fields -- for removing comments
                      handleCancel();
                    }
                    }
                  }
                  defaultValue="no"
                >
                  <Radio value="yes">Yes</Radio>
                  <Radio
                    value="no"
                    onClick={() => {
                      form.resetFields(); // Reset all fields -- for removing comments
                      handleCancel();
                    }}
                  >
                    No
                  </Radio>
                </Radio.Group>
              </Form.Item>

              {isApprovalSectionVisible && (
                <>
                  <Form.List name="approvalSequence" initialValue={[]}>
                    {(fields, { add, remove }) => {
                      // Collect currently selected department heads and approval sequences
                      const selectedDepartmentHeads = fields.map((field) =>
                        form.getFieldValue([
                          "approvalSequence",
                          field.name,
                          "EmployeeId",
                        ])
                      );
                      const selectedDpartments = fields.map((field) =>
                        form.getFieldValue([
                          "approvalSequence",
                          field.name,
                          "DepartmentId",
                        ])
                      );

                      return (
                        <>
                          {fields.map(({ key, name }) => (
                            <Row gutter={16} key={key}>
                              <Col span={10}>
                                <Form.Item
                                  name={[name, "EmployeeId"]}
                                  label="Department Head"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please select a department head",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select Department Head"
                                    onChange={(value) => {
                                      // Get the selected department for the chosen head
                                      const selectedHead = departmentHeads.find(
                                        (head) => head.EmployeeId === value
                                      );
                                      const departmentId =
                                        selectedHead?.DepartmentId || null;

                                      // Update both EmployeeId and DepartmentId in the form
                                      form.setFieldsValue({
                                        approvalSequence: form
                                          .getFieldValue("approvalSequence")
                                          .map((sequence: any, index: any) =>
                                            index === name
                                              ? {
                                                  ...sequence,
                                                  EmployeeId: value,
                                                  DepartmentId: departmentId,
                                                }
                                              : sequence
                                          ),
                                      });
                                    }}
                                  >
                                    {departmentHeads
                                      .filter(
                                        (departmentHead) =>
                                          !selectedDepartmentHeads.includes(
                                            departmentHead.EmployeeId
                                          ) ||
                                          departmentHead.EmployeeId ===
                                            form.getFieldValue([
                                              "approvalSequence",
                                              name,
                                              "EmployeeId",
                                            ])
                                      )
                                      .map((departmentHead) => (
                                        <Option
                                          key={departmentHead.EmployeeId}
                                          value={departmentHead.EmployeeId}
                                        >
                                          {departmentHead.EmployeeName}
                                        </Option>
                                      ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item
                                  name={[name, "DepartmentId"]}
                                  label="Department"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select Department",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select Sequence"
                                    onChange={(value) => {
                                      // Update only the DepartmentId for the specific row
                                      form.setFieldsValue({
                                        approvalSequence: form
                                          .getFieldValue("approvalSequence")
                                          .map((sequence: any, index: any) =>
                                            index === name
                                              ? {
                                                  ...sequence,
                                                  DepartmentId: value,
                                                }
                                              : sequence
                                          ),
                                      });

                                      // Check if this DepartmentId maps to a Department Head
                                      const departmentHead =
                                        departmentHeads.find(
                                          (head) => head.DepartmentId === value
                                        );

                                      // Update EmployeeId if a matching head exists
                                      if (departmentHead) {
                                        form.setFieldsValue({
                                          approvalSequence: form
                                            .getFieldValue("approvalSequence")
                                            .map((sequence: any, index: any) =>
                                              index === name
                                                ? {
                                                    ...sequence,
                                                    EmployeeId:
                                                      departmentHead.EmployeeId,
                                                  }
                                                : sequence
                                            ),
                                        });
                                      }
                                    }}
                                  >
                                    {cellDepartments
                                      .filter(
                                        (department) =>
                                          !selectedDpartments.includes(
                                            department.DepartmentId
                                          ) ||
                                          department.DepartmentId ===
                                            form.getFieldValue([
                                              "approvalSequence",
                                              name,
                                              "DepartmentId",
                                            ])
                                      )
                                      .map((department) => (
                                        <Option
                                          key={department.DepartmentId}
                                          value={department.DepartmentId}
                                        >
                                          {department.DepartmentName}
                                        </Option>
                                      ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col
                                span={0}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Button 
                                disabled={(form.getFieldValue("AdditionalApprovalRequired")=="yes" && fields?.length==1)} 
                                onClick={() => remove(name)}>
                                  <FontAwesomeIcon
                                    title="Remove"
                                    icon={faTrash}
                                  />
                                </Button>
                              </Col>
                            </Row>
                          ))}

                          {/* Add button to add new department head */}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<i className="anticon anticon-plus" />}
                              disabled={fields?.length >= 2} // Disable Add button if there are 3 or more fields
                            >
                              Add Department Head
                            </Button>
                          </Form.Item>

                         
                        </>
                      );
                    }}
                  </Form.List>
                </>
              )}
            </>
          )}
          {depDivHead && currentApproverTask?.seqNumber==LEVELS.Level7 && actionType == ACTION_TYPE.Approve && (
            <Form.Item
              label="Division Head approval required ?"
              name={"DivisionHeadApprovalRequired"}
              rules={[{ required: true, message: "Please select Yes/No" }]}
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          {
            user?.isAdmin && actionType == ACTION_TYPE.Deligate ?(
            <Form.Item
                        name="DeligateUserId"
                        label="Select a Deligate User"
                        rules={[{ required: true, message: "Please select a Deligate User." }]}
                      >
                        <Select
                          allowClear
                          placeholder="Select a Deligate User"
                          options={employeesResult.ReturnValue?.map((emp) => ({
                            label: emp.employeeName,
                            value: emp.employeeId,
                          }))}
                          showSearch
                          filterOption={(input, option) =>
                            option?.label
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          
                        />
                      </Form.Item>):(<></>)
          }
          <Form.Item
            label="Comments"
            name="comment"
            rules={[{ required: true, message: "Please enter Comments" }]} // Validation rule
          >
            <Input.TextArea
            maxLength={500}
              rows={4}
              placeholder="Please provide your comment"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={approving || pullingBack} fullscreen />
    </>
  );
};

export default WorkFlowButtons;
