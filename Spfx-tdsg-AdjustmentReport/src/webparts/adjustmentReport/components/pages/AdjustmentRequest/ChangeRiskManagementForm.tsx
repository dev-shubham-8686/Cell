import { Col, DatePicker, Divider, Form, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
import { DATE_FORMAT } from "../../../GLOBAL_CONSTANT";
import { disabledDate } from "../../../utils/helper";
import { Option } from "antd/es/mentions";

const ChangeRiskManagementForm = () => {
  return (
    <div>
      <Divider orientation="left">Change Risk Management</Divider>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Changes" name="changes">
            <TextArea rows={2} maxLength={100} placeholder="Changes" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Function" name="function">
            <TextArea rows={2} placeholder="Function" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Risk Associated With Changes"
            name="riskWithChanges"
          >
            <TextArea
              rows={2}
              maxLength={1000}
              placeholder="Risk Associated With Changes"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Factor/causes" name="factor">
            <TextArea rows={2} maxLength={1000} placeholder="Factor" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Counter Measures" name="counterMeasures">
            <TextArea
              rows={2}
              maxLength={1000}
              placeholder="Counter Measures"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Due Date"
            name="date"
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
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Person In Charge" name="personInCharge">
            <Select placeholder="Select Person in Charge">
              <Option value="john">John</Option>
              <Option value="mike">Mike</Option>
              <Option value="matt">Matt</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Results" name="results">
            <TextArea rows={2} maxLength={1000} placeholder="Results" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ChangeRiskManagementForm;
