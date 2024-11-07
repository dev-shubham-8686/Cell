import { Modal, Button, Select, Form } from "antd";
import * as React from "react";
import { useState } from "react";

const { Option } = Select;

interface AdditionalApprovalModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (approvalData: any) => void;
}

const AdditionalApprovalModal: React.FC<AdditionalApprovalModalProps> = ({
  visible,
  onClose,
  onProceed,
}) => {
  const [approvalRows, setApprovalRows] = useState([{ id: 1, deptHead: "", sequence: "" }]);

  const addApprovalRow = () => {
    setApprovalRows([...approvalRows, { id: approvalRows.length + 1, deptHead: "", sequence: "" }]);
  };

  const handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = approvalRows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
    setApprovalRows(updatedRows);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="Additional Approval"
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical">
        {approvalRows.map((row, index) => (
          <div key={row.id} className="approval-row">
            <Form.Item label="Department Head">
              <Select
                placeholder="Select Department Head"
                onChange={(value) => handleRowChange(index, "deptHead", value)}
              >
                {/* Replace with actual department head data */}
                <Option value="Head1">Head 1</Option>
                <Option value="Head2">Head 2</Option>
                {/* Add more options */}
              </Select>
            </Form.Item>

            <Form.Item label="Approval Sequence">
              <Select
                placeholder="Select Sequence"
                onChange={(value) => handleRowChange(index, "sequence", value)}
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
              </Select>
            </Form.Item>
          </div>
        ))}
        <Button type="dashed" onClick={addApprovalRow}>
          Add Approval Row
        </Button>
        <div className="modal-footer">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => onProceed(approvalRows)}
          >
            Proceed
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdditionalApprovalModal;
