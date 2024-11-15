import { useState } from "react";
import { Button, Modal, Input, Form, Select, Row, Col } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import * as React from "react";
import { useUserContext } from "../../context/UserContext";
import { useGetAllAdvisors } from "../../hooks/useGetAllAdvisors";

const { Option } = Select;

interface WorkFlowButtonsProps {
  onApprove: (comment: string) => Promise<void>;
  onAskToAmend: (comment: string) => Promise<void>;
  onPullBack: (comment: string) => Promise<void>;
  currentApproverTask: any;
  existingAdjustmentReport: any;
  isFormModified: boolean;
  advisorRequired: boolean;
  departmentHead: boolean;
}

const WorkFlowButtons: React.FC<WorkFlowButtonsProps> = ({
  onApprove,
  onAskToAmend,
  onPullBack,
  currentApproverTask,
  existingAdjustmentReport,
  isFormModified,
  advisorRequired,
  departmentHead
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

  const { data: advisors = [] } = useGetAllAdvisors();
  const [isApprovalSectionVisible, setApprovalSectionVisible] = useState(false);

  React.useEffect(() => {
    debugger
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
    debugger
    setShowWorkflowBtns(
      currentApproverTask?.approverTaskId &&
      currentApproverTask?.approverTaskId !== 0
    );
    console.log({showWorkflowBtns})
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
    setApprovalSectionVisible(false); // Hide the approval section
  };

  // Handle opening the modal for comment input
  const handleClick = (type: string) => {
    setActionType(type);
    setIsModalVisible(true); // Open comment modal
  };

  // Handle the submit action after getting the comment
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      setLoading(true);
      const comment = values.comment; // Get the validated comment

      if (actionType === "approve") {
        await onApprove(comment);
      } else if (actionType === "amend") {
        await onAskToAmend(comment);
      } else if (actionType === "pullback") {
        await onPullBack(comment);
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
      {showWorkflowBtns && approverRequest ? (
        <>
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              isFormModified && handleClick("approve");
            }}
            style={{ marginRight: "10px" }}
          >
            Approve
          </Button>

          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              isFormModified && handleClick("amend");
            }}
            style={{ marginRight: "10px" }}
          >
            Ask to Amend
          </Button>
        </>
      ) : null}

      {existingAdjustmentReport?.isSubmit &&
        existingAdjustmentReport?.status !== "UnderAmendment" &&
        user?.EmployeeId === existingAdjustmentReport?.userId &&
        existingAdjustmentReport?.seqNumber < 2 ? (
        <Button
          color="primary"
          variant="solid"
          onClick={() => handleClick("pullback")}
        >
          Pullback
        </Button>
      ) : null}

      {/* Comment Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={getOkText()} // Dynamic okText based on action type
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          {advisorRequired && (
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
          )}

          {departmentHead && (
            <Form.Item>
              <Button type="primary" onClick={handleApprovalButtonClick}>
                Additional Approval Required?
              </Button>
            </Form.Item>
          )}

          {/* Conditional Approval Section */}
          {isApprovalSectionVisible && (
            <>
              <Form.List name="approvalSequence" initialValue={[]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Row gutter={16} key={key}>
                        <Col span={8}>
                          <Form.Item
                            name={[name, "departmentHead"]}
                            label="Department Head"
                            rules={[{ required: true, message: "Please select a department head" }]}
                          >
                            <Select placeholder="Select Department Head">
                              {advisors.map((advisor) => (
                                <Option key={advisor.employeeId} value={advisor.employeeId}>
                                  {advisor.employeeName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name={[name, "approvalSequence"]}
                            label="Approval Sequence"
                            rules={[{ required: true, message: "Please select approval sequence" }]}
                          >
                            <Select placeholder="Select Sequence">
                              <Option value={1}>1</Option>
                              <Option value={2}>2</Option>
                              <Option value={3}>3</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                          <Button
                            type="danger"
                            onClick={() => remove(name)}
                            style={{ width: "100%" }}
                          >
                            Remove
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
                      >
                        Add Department Head
                      </Button>
                    </Form.Item>

                    {/* Proceed and Cancel buttons */}
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={handleProceed}
                        style={{ marginRight: "8px" }}
                      >
                        Proceed
                      </Button>
                      <Button onClick={handleCancel}>Cancel</Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

            </>
          )}

          <Form.Item
            label="Comments"
            name="comment"
            rules={[{ required: true }]} // Validation rule
          >
            <Input.TextArea rows={4} placeholder="Please provide your comment" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WorkFlowButtons;
