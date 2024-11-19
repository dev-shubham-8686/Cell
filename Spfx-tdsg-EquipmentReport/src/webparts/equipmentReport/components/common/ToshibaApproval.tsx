import {
 
  Button,
  Modal,
  message,
  Form,
  Spin,
  Switch,
  Select,
  DatePicker,
} from "antd";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import dayjs from "dayjs";
import useAreaMaster from "../../apis/masters/useAreaMaster";

interface ApprovalModalProps {
  setmodalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}

const ToshibaApprovalModal: React.FC<ApprovalModalProps> = ({
  setmodalVisible,
  visible,
}) => {
  const { id } = useParams();
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [status, setStatus] = useState<any>("");
  const [reviewers, setReviewers] = useState("");
  const [remarks, setRemarks] = useState("");
  const { data: areas, isLoading: areaIsLoading } = useAreaMaster();

  const onClose = () => {
    form.resetFields();
    setmodalVisible(false);
    setStatus("scrap");
  };
  const handleConfirm = () => {
    console.log("Submitted O R with reviewers", reviewers);
    onClose();
  };
  return (
    <>
      <Modal
        title="Select Target Date"
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
         
          {(
            <Form.Item
            //   label="Please select Target Date "
              name="reviewers"
            >
              <DatePicker 
                disabledDate={(current) => {
                    // future dates only
                    return current && current <= dayjs().endOf('day');
                  }}
              />

            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ToshibaApprovalModal;
