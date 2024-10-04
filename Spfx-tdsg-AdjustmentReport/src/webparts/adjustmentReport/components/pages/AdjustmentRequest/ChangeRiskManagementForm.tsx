import { Col, Collapse, DatePicker, Form, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
import { DATE_FORMAT } from "../../../GLOBAL_CONSTANT";
import { disabledDate } from "../../../utils/helper";
import { Option } from "antd/es/mentions";

const { Panel } = Collapse;

interface ChangeRiskManagementFormProps {
  index: number;
}

const ChangeRiskManagementForm: React.FC<ChangeRiskManagementFormProps> = ({
  index,
}) => {
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
              <Form.Item label="Function" name={`function-${index}`}>
                <TextArea rows={2} placeholder="Function" />
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
              <Form.Item label="Factor/causes" name={`factor-${index}`}>
                <TextArea rows={2} maxLength={1000} placeholder="Factor" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={6}>
              <Form.Item
                label="Due Date"
                name={`date-${index}`}
                rules={[{ required: true, message: "Please Select Date" }]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  showTime
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
                  <Option value="john">John</Option>
                  <Option value="mike">Mike</Option>
                  <Option value="matt">Matt</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Results" name={`results-${index}`}>
                <TextArea rows={2} maxLength={1000} placeholder="Results" />
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
        </Panel>
      </Collapse>
    </div>
  );
};

export default ChangeRiskManagementForm;
