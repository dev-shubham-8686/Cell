import { Input, Radio, Button, Modal, message, Form, Spin, Switch, Select } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";


interface CloseModalProps {
  setmodalVisible: React.Dispatch<React.SetStateAction<boolean>> ;
  visible: boolean;
}

const OptionalReviewModal: React.FC<CloseModalProps> = ({ setmodalVisible, visible }) => {
  const { id } = useParams();
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [status, setStatus] = useState<any>("");
  const [reviewers, setReviewers] = useState("");
  const [remarks, setRemarks] = useState("");

  const onClose =()=>{
    
    form.resetFields();
    setmodalVisible(false);
    setStatus("scrap")
  }
  const handleConfirm = () => {
    console.log("Submitted O R with reviewers",reviewers)
    onClose();
  };
  return (
    <>
      <Modal
        title="Select an Option"
        visible={visible}
        onCancel={onClose}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button
              key="cancel"
              className="btn-outline-primary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              key="confirm"
              className="btn btn-primary"
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
              style={{ marginBottom: "6px" }}
            >
              Confirm
            </Button>
          </>
        )}
      >
        {console.log("Status", status)}
  
        <Form form={form} onFinish={handleConfirm}>
          {/* Switch for Optional Review Required */}
          <Form.Item
            label="Optional Review Required?"
            name="optionalReview"
            valuePropName="checked"
          >
            <Switch
              checked={status === "reviewRequired"}
              onChange={(checked) => setStatus(checked ? "reviewRequired" : "noReview")}
            />
          </Form.Item>
  
          {/* Multi-select dropdown visible only when the switch is on */}
          {status === "reviewRequired" && (
            <Form.Item
              name="reviewers"
              rules={[
                {
                  required: true,
                  message: "Please select at least one reviewer.",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Please select reviewers"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => setReviewers(value)}
              >
                <Select.Option value="reviewer1">Reviewer 1</Select.Option>
                <Select.Option value="reviewer2">Reviewer 2</Select.Option>
                <Select.Option value="reviewer3">Reviewer 3</Select.Option>
              </Select>
            </Form.Item>
          )}
  
        
        </Form>
      </Modal>
    </>
  );
  
};

export default OptionalReviewModal;
