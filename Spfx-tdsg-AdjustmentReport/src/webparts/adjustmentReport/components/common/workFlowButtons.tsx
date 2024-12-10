import { useState } from "react";
import { Button, Modal, Input, Form, Select, Row, Col, Radio } from "antd";
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
import { values } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ACTION_TYPE, REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import { IPullBack } from "../../api/PullBack.api";
import { usePullBack } from "../../hooks/usePullBack";

const { Option } = Select;

interface WorkFlowButtonsProps {
  currentApproverTask: any;
  existingAdjustmentReport: any;
  isFormModified: boolean;
  departmentHead: boolean;
  depDivHead?:boolean
}

const WorkFlowButtons: React.FC<WorkFlowButtonsProps> = ({
  currentApproverTask,
  existingAdjustmentReport,
  isFormModified,
  departmentHead,
  depDivHead
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isApproverRequest } = location.state || {};
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
  const { mutate: approveAskToAmend } = useUpdateApproveAskToAmend();
  const { mutate: pullback } = usePullBack();
  const { data: advisors = [] } = useGetAllAdvisors();
  const { data: departmentHeads  } = useGetAdditionalDepartmentHeads();
  console.log({ departmentHeads });
  const [isApprovalSectionVisible, setApprovalSectionVisible] = useState(false);
  const [isDivHeadRequired, setisDivHeadRequired] = useState(false);

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
      setApproverRequest(true);

      // Use `navigate` to replace the URL with the cleaned parameters, and set tab state
      navigate(location.pathname, {
        state: {
          currentTabState: "myapproval-tab",
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

  const handleApprovalButtonClick = () => {
    setApprovalSectionVisible(!isApprovalSectionVisible);
  };

  const handleProceed = () => {
    const approvalSequenceValues = form.getFieldsValue(["approvalSequence"]);
    console.log("Submitted approval sequence:", approvalSequenceValues);

    // Handle form submission, e.g., send data to an API or update the state
  };

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
    
    const updatedApprovalSequence = approvalSequence?.map((sequenceItem:any) => {
      const employee = departmentHeads.find(
        (head) => head.EmployeeId == sequenceItem.EmployeeId
      );
      
      return {
        ...sequenceItem,
        DepartmentId: employee?.DepartmentId || null, // Add DepartmentId or null if not found
      };
      
    });
    const data: IApproveAskToAmendPayload = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.employeeId ? user?.employeeId : 0,
      Type: 1, //Approved
      Comment: comment,
      AdjustmentId: id ? parseInt(id, 10) : 0,
      AdditionalDepartmentHeads:
      updatedApprovalSequence as IAdditionalDepartmentHeads[],
      IsDivHeadRequired:form.getFieldValue("DivisionHeadApprovalRequired") 
    };
    
console.log("Approve a to a payload ",data)
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
    
    approveAskToAmend(
      data,
      {
        onSuccess: () => {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });

        }
      }
    );
  };
  
  const handlePullBack = async (comment: string): Promise<void> => {
    const data: IPullBack = {
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      userId: user?.employeeId ? user?.employeeId : 0,
      comment: comment,
    };

    pullback(
      data,
      {
        onSuccess: (data) => {
          navigate("/");
        }
      }
    );
  };
  // Handle the submit action after getting the comment
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      setLoading(true);

      const comment = values.comment; // Get the validated comment
     
      
      if (actionType === "approve") {
        await handleApprove(comment, values.approvalSequence);
      } else if (actionType === "amend") {
        await handleAskToAmend(comment);
      } else if (actionType === "pullback") {
        await handlePullBack(comment);
      }
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo); // Handle validation failure
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      form.resetFields(); // Clear form after submission
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
      {existingAdjustmentReport?.IsSubmit &&
      existingAdjustmentReport?.Status !== REQUEST_STATUS.UnderAmendment &&
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
          {/* {advisorRequired && (
            <Form.Item
              label="Select Advisor"
              name="advisor"
              rules={[{ required: true, message: "Please select an advisor" }]} // Validation rule
            >
              <Select placeholder="Please select an advisor">
                {advisors.map((advisor) => (
                  <Option key={advisor.employeeId} value={advisor.employeeId}>
                    {advisor.employeeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )} */}

          {/* {departmentHead && (
            <Form.Item>
              <Button type="primary" onClick={handleApprovalButtonClick}>
                Additional Approval Required?
              </Button>
            </Form.Item>
          )} */}

          {/* Conditional Approval Section */}
          {
            isApprovalSectionVisible && <></>
            //  (
            //   <>
            //     <Form.List name="approvalSequence" initialValue={[]}>
            //       {(fields, { add, remove }) => {
            //         // Collect currently selected department heads and approval sequences
            //         const selectedDepartmentHeads = fields.map((field) =>
            //           form.getFieldValue([
            //             "approvalSequence",
            //             field.name,
            //             "departmentHead",
            //           ])
            //         );
            //         const selectedSequences = fields.map((field) =>
            //           form.getFieldValue([
            //             "approvalSequence",
            //             field.name,
            //             "approvalSequence",
            //           ])
            //         );

            //         return (
            //           <>
            //             {fields.map(({ key, name }) => (
            //               <Row gutter={16} key={key}>
            //                 <Col span={10}>
            //                   <Form.Item
            //                     name={[name, "departmentHead"]}
            //                     label="Department Head"
            //                     rules={[
            //                       {
            //                         required: true,
            //                         message: "Please select a department head",
            //                       },
            //                     ]}
            //                   >
            //                     <Select placeholder="Select Department Head">
            //                       {departmentHeads
            //                         .filter(
            //                           (departmentHead) =>
            //                             !selectedDepartmentHeads.includes(
            //                               departmentHead.EmployeeId
            //                             ) ||
            //                             departmentHead.EmployeeId ===
            //                               form.getFieldValue([
            //                                 "approvalSequence",
            //                                 name,
            //                                 "departmentHead",
            //                               ])
            //                         )
            //                         .map((departmentHead) => (
            //                           <Option
            //                             key={departmentHead.EmployeeId}
            //                             value={departmentHead.EmployeeId}
            //                           >
            //                             {departmentHead.EmployeeName}
            //                           </Option>
            //                         ))}
            //                     </Select>
            //                   </Form.Item>
            //                 </Col>
            //                 <Col span={10}>
            //                   <Form.Item
            //                     name={[name, "approvalSequence"]}
            //                     label="Approval Sequence"
            //                     rules={[
            //                       {
            //                         required: true,
            //                         message: "Please select approval sequence",
            //                       },
            //                     ]}
            //                   >
            //                     <Select placeholder="Select Sequence">
            //                       {[1, 2, 3]
            //                         .filter(
            //                           (seq) =>
            //                             !selectedSequences.includes(seq) ||
            //                             seq ===
            //                               form.getFieldValue([
            //                                 "approvalSequence",
            //                                 name,
            //                                 "approvalSequence",
            //                               ])
            //                         )
            //                         .map((seq) => (
            //                           <Option key={seq} value={seq}>
            //                             {seq}
            //                           </Option>
            //                         ))}
            //                     </Select>
            //                   </Form.Item>
            //                 </Col>
            //                 <Col
            //                   span={0}
            //                   style={{ display: "flex", alignItems: "center" }}
            //                 >
            //                   <Button
            //                     onClick={() => remove(name)}
            //                   >
            //                     <FontAwesomeIcon title="Remove" icon={faTrash} />
            //                   </Button>
            //                 </Col>
            //               </Row>
            //             ))}

            //             {/* Add button to add new department head */}
            //             <Form.Item>
            //               <Button
            //                 type="dashed"
            //                 onClick={() => add()}
            //                 block
            //                 icon={<i className="anticon anticon-plus" />}
            //                 disabled={fields.length >= 3} // Disable Add button if there are 3 or more fields
            //               >
            //                 Add Department Head
            //               </Button>
            //             </Form.Item>

            //             {/* Proceed and Cancel buttons */}
            //             <Form.Item>
            //               <Button
            //                 type="primary"
            //                 onClick={handleProceed}
            //                 style={{ marginRight: "8px" }}
            //               >
            //                 Proceed
            //               </Button>
            //               <Button
            //                 onClick={() => {
            //                   
            //                   form.resetFields(); // Reset all fields --  for removing comments
            //                   handleCancel();
            //                 }}
            //               >
            //                 Cancel
            //               </Button>
            //             </Form.Item>
            //           </>
            //         );
            //       }}
            //     </Form.List>
            //   </>
            // )
          }
          {(departmentHead && actionType==ACTION_TYPE.Approve) && (
            <>
              <Form.Item
                label="Additional Approval Required?"
                name={"AdditionalApprovalRequired"}
              >
                <Radio.Group
                  onChange={(e) =>
                    setApprovalSectionVisible(e.target.value === "yes")
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
                      const selectedSequences = fields.map((field) =>
                        form.getFieldValue([
                          "approvalSequence",
                          field.name,
                          "ApprovalSequence",
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
                                  <Select placeholder="Select Department Head">
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
                                  name={[name, "ApprovalSequence"]}
                                  label="Approval Sequence"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please select approval sequence",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Select Sequence">
                                    {[1, 2, 3]
                                      .filter(
                                        (seq) =>
                                          !selectedSequences.includes(seq) ||
                                          seq ===
                                            form.getFieldValue([
                                              "approvalSequence",
                                              name,
                                              "ApprovalSequence",
                                            ])
                                      )
                                      .map((seq) => (
                                        <Option key={seq} value={seq}>
                                          {seq}
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
                                <Button onClick={() => remove(name)}>
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
                              disabled={fields.length >= 3} // Disable Add button if there are 3 or more fields
                            >
                              Add Department Head
                            </Button>
                          </Form.Item>

                          {/* Proceed and Cancel buttons */}
                          {/* <Form.Item>
                            <Button
                              type="primary"
                              onClick={handleProceed}
                              style={{ marginRight: "8px" }}
                            >
                              Proceed
                            </Button>
                            <Button
                              onClick={() => {
                                
                                form.resetFields(); // Reset all fields -- for removing comments
                                handleCancel();
                              }}
                            >
                              Cancel
                            </Button>
                          </Form.Item> */}
                        </>
                      );
                    }}
                  </Form.List>
                </>
              )}
            </>
          )}
          { (depDivHead  && actionType==ACTION_TYPE.Approve) &&
            <Form.Item
              label="Divison Head approval required ?"
              name={"DivisionHeadApprovalRequired"}
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          }
          <Form.Item
            label="Comments"
            name="comment"
            rules={[{ required: true }]} // Validation rule
          >
            <Input.TextArea
              rows={4}
              placeholder="Please provide your comment"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WorkFlowButtons;
