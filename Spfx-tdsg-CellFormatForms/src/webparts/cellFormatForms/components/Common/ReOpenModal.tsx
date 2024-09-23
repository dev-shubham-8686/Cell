import React, { useEffect, useState } from "react";
import { Modal, Select } from "antd";

interface IProps {
  isVisible: boolean;
  onCancel: any;
  onOk: any;
  options: any;
}
const CustomModal: React.FC<IProps> = ({
  isVisible,
  onCancel,
  onOk,
  options,
}) => {
  const [selectedRaiserId, setSelectedRaiserId] = useState<number | null>(null);
  const [empOptions, setempOptions] = useState([]);

  useEffect(() => {
    setempOptions(options);
  }, [options]);

  console.log("options", options.length, empOptions);

  return (
    <Modal
      title="Please select the Raiser"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => onOk(selectedRaiserId)}
      okButtonProps={{ disabled: !selectedRaiserId }}
      cancelText="No"
      okText="Yes"
    >
      <Select
        showSearch
        allowClear
        optionFilterProp="children"
        style={{ width: "100%" }}
        placeholder="Select Employee Name"
        onChange={(value: number) => setSelectedRaiserId(value)}
        filterOption={(input, option) =>
          option?.children
            .toString()
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        className="custom-disabled-select mt-3 my-4"
      >
        {options?.map((employee: any) => (
          <Select.Option key={employee.employeeId} value={employee.employeeId}>
            {employee.employeeName}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default CustomModal;
