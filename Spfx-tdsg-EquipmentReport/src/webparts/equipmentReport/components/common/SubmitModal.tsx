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
  const { data: areas, isLoading: areaIsLoading } = useAreaMaster();

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
              style={{ marginBottom: "6px" }}
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button>
          </>
        )}
      >
        {console.log("Status", status)}

        <Form form={form} onFinish={handleConfirm}>
          <Form.Item
            label={<span className="text-muted">Area</span>}
            name="sectionHeadId"
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={areas?.map((area) => ({
                label: area.AreaName,
                value: area.AreaId,
              }))}
              loading={areaIsLoading}
              className="custom-disabled-select"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SubmitModal;
