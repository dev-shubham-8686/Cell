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
import useSectionHeadDetails from "../../apis/masters/useSectionHead";

interface SubmitModalProps {
  setmodalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  onSubmit: (dropdownValue: string) => void;
}

const SubmitModal: React.FC<SubmitModalProps> = ({
  setmodalVisible,
  visible,
  onSubmit,
}) => {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [sectionHead, setsectionHead] = useState(0);
  const { data: sectionHeads, isLoading: sectionHeadIsLoading } = useSectionHeadDetails(user.departmentId);

   console.log("SectionHeads",sectionHeads)
  const onClose = () => {
    form.resetFields();
    setmodalVisible(false);
  };
  const handleConfirm = (values: any) => {
    console.log("Submitted with sec head ", values);
    onSubmit(values.sectionHeadId);
    onClose();
  };
  return (
    <>
      <Modal
        title="Select Section Head"
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
            <div className="mb-3">
              <Button
              key="confirm"
              className="btn btn-primary "
              type="primary"
              htmlType="submit"
              style={{ marginBottom: "6px" }}
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button></div>
            
          </>
        )}
      >
        {console.log("Status", status)}

        <Form form={form} onFinish={handleConfirm}>
          <Form.Item
            label={<span className="text-muted">Section Head</span>}
            name="sectionHeadId"
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={sectionHeads?.map((area) => ({
                label: area.headName,
                value: area.head,
              }))}
              loading={sectionHeadIsLoading}
              className="custom-disabled-select"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SubmitModal;
