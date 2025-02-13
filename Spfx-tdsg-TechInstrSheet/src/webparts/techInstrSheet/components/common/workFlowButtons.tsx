import React, { useState } from "react";
import { Button, Modal, Input, Form, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { getAllEmployee } from "../../api/technicalInstructionApi";
import displayjsx from "../../utils/displayjsx";
//import displayjsx from "../../utils/displayjsx";

const { Option } = Select;

interface WorkFlowButtonsProps {
  onApprove: (comment: string) => Promise<void>;
  onAskToAmend: (comment: string) => Promise<void>;
  onPullBack: (comment: string) => Promise<void>;
  currentApproverTask: any;
  existingTechniaclInstructionSlip: any;
  isFormModified: boolean;
  onDelegate: (userId: string, comment: string) => Promise<void>;
  isFromAllRequest: any
}

const WorkFlowButtons: React.FC<WorkFlowButtonsProps> = ({
  onApprove,
  onAskToAmend,
  onPullBack,
  currentApproverTask,
  existingTechniaclInstructionSlip,
  isFormModified,
  onDelegate,
  isFromAllRequest
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
  const user = React.useContext(UserContext);

  const [selectedOwner, setSelectedOwner] = React.useState<number | null>(null);
  const [empData, setEmpData] = React.useState<any[]>([]);
  const [empVisibale, setEmpVisibale] = useState(false);
  React.useEffect(() => {
    //debugger;
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

  // Handle opening the modal for comment input
  const handleClick = (type: string) => {
    setEmpVisibale(false);
    setActionType(type);
    if (type === "delegate") {
      setEmpVisibale(true);
    }
    form.resetFields();
    setSelectedOwner(null);
    setEmpData([]);
    setLoading(true);
    getAllEmployee()
      .then((data) => {
        setLoading(false);
        let returnData = data.ReturnValue;
        setEmpData(returnData); // Set fetched section data
      })
      .catch((err) => {
        setLoading(false);
      });
    setIsModalVisible(true); // Open comment modal
  };

  // Handle the submit action after getting the comment
  const handleSubmit = async () => {
    let delegateUser = selectedOwner;
    if (actionType === "delegate" && delegateUser == null) {
      void displayjsx.showErrorMsg("Please select delegate user");
      return false;
    }

    const values = await form.validateFields(); // Validate form fields
    const comment = values.comment; // Get the validated comment

    // // Check if comment is null, empty, or whitespace
    // if (!comment) {
    //   void displayjsx.showErrorMsg(
    //     "Please enter Comment"
    //   );
    //   return; // Exit function without closing the modal
    // }

    // // Check if comment exceeds the maximum length
    // if (comment.length > 500) {
    //  void displayjsx.showErrorMsg("Comment should not exceed 500 characters.");
    //   return; // Exit function without closing the modal
    // }

    try {
      setLoading(true);
      if (actionType === "approve") {
        await onApprove(comment);
      } else if (actionType === "amend") {
        await onAskToAmend(comment);
      } else if (actionType === "pullback") {
        await onPullBack(comment);
      } else if (actionType === "delegate") {
        await onDelegate(selectedOwner?.toString() ?? "", comment);
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
    if (actionType === "delegate") return "Delegate";
    return "Submit"; // Fallback
  };

  return (
    <>
      {existingTechniaclInstructionSlip?.status == "InReview" &&
        user?.isAdmin && isFromAllRequest &&(
          <Button
            type="primary"
            variant="solid"
            onClick={() => {
              isFormModified && handleClick("delegate");
            }}
            style={{ marginRight: "10px" }}
          >
            Delegate
          </Button>
        )}
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

      {existingTechniaclInstructionSlip?.isSubmit &&
      existingTechniaclInstructionSlip?.status !== "UnderAmendment" &&
      existingTechniaclInstructionSlip?.status !== "Closed" &&
      existingTechniaclInstructionSlip?.status !== "Completed" &&
      existingTechniaclInstructionSlip?.status !== "Approved" &&
      user?.employeeId === existingTechniaclInstructionSlip?.userId &&
      existingTechniaclInstructionSlip?.seqNumber < 3 ? (
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
        //title={`Add Comment for ${actionType}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={getOkText()} // Dynamic okText based on action type
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          {empVisibale && (
            <Form.Item
              label="Select Delegate User"
              rules={[{ required: true, message: "Please select an option!" }]}
            >
              <Select
                placeholder="Please Select or Serach a Delegate User"
                value={selectedOwner}
                onChange={(value: number) => setSelectedOwner(value)} // Set the selected section
                showSearch // Enable search
                filterOption={
                  (input, option: any) =>
                    option?.children &&
                    option.children.toLowerCase().includes(input.toLowerCase()) // Check if option.children exists
                }
                optionFilterProp="children" // Define which property to filter by
                style={{ width: "100%" }}
              >
                {empData.map((emp) => (
                  <Option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {`${emp.EmployeeName} ( ${emp.Email} )`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Comments"
            name="comment"
            rules={[{ required: true, max: 500 }]} // Validation rule
          >
            <Input.TextArea
              rows={4}
              //placeholder="Please provide your comment"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WorkFlowButtons;
