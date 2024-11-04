import { Col, Collapse, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
import { DATE_FORMAT } from "../../../GLOBAL_CONSTANT";
import { disabledDate } from "../../../utils/helper";
import { useGetAllEmployees } from "../../../hooks/useGetAllEmployees";

const { Panel } = Collapse;
const { Option } = Select;

interface ChangeRiskManagementFormProps {
  form: any;
  index: number;
}

const ChangeRiskManagementForm: React.FC<ChangeRiskManagementFormProps> = ({
  form,
  index,
}) => {
  const { data: employeesResult } = useGetAllEmployees();

  return (
    <div className="my-3">
      <Collapse defaultActiveKey={["1"]}>
        <Panel header={`Change Risk Management ${index + 1}`} key={index}>
          <Row gutter={48}>
            <Col span={6}>
              <Form.Item label="Changes" name={`changes-${index}`}>
                <TextArea rows={2} maxLength={100} placeholder="Changes" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Risk Associated With Changes"
                name={`riskWithChanges-${index}`}
              >
                <TextArea
                  rows={2}
                  maxLength={1000}
                  placeholder="Risk Associated With Changes"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Factor/Causes" name={`factor-${index}`}>
                <TextArea rows={2} maxLength={1000} placeholder="Factor" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Counter Measures"
                name={`counterMeasures-${index}`}
              >
                <TextArea
                  rows={2}
                  maxLength={1000}
                  placeholder="Counter Measures"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={6}>
              <Form.Item label="Function" name={`function-${index}`}>
                <Input placeholder="Enter Function" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Due Date"
                name={`date-${index}`}
                rules={[{ required: true, message: "Please Select Date" }]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  placeholder="Date"
                  format={DATE_FORMAT}
                  className="bg-antdDisabledBg border-antdDisabledBorder w-full"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Person In Charge"
                name={`personInCharge-${index}`}
              >
                <Select placeholder="Select Person in Charge">
                  {employeesResult?.ReturnValue &&
                    employeesResult.ReturnValue.map((employee) => (
                      <Option key={employee.employeeId} value={employee.employeeId}>
                        {employee.employeeName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Results" name={`results-${index}`}>
                <TextArea rows={2} maxLength={1000} placeholder="Results" />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ChangeRiskManagementForm;
