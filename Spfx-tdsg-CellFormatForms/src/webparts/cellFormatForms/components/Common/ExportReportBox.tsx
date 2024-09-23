import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import {
  Modal,
  Button,
  Form,
  DatePicker,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { DATE_FORMAT } from "../GLOBAL_CONSTANT";

const { Option } = Select;

interface ExportReportBoxProps {
  buttonText: string;
  onCancel: () => void;
  onFinish: (values: any) => Promise<void>;
}

const ExportReportBox = forwardRef(
  ({ buttonText, onCancel, onFinish }: ExportReportBoxProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState<string | null>(null); // Initialize status as null
    const [fromDate, setFromDate] = useState<Date | null>(null); // Set fromDate type to Date | null
    const [toDate, setToDate] = useState<Date | null>(null); // Set toDate type to Date | null
    const [form] = useForm();
    interface StatusOption {
      label: string;
      value: string;
    }

    const handleClose = () => {
      setVisible(false);
      setStatus(null); // Reset status to null
      setFromDate(null);
      setToDate(null);
      form.resetFields();
    };
    useImperativeHandle(ref, () => ({
      openModal: () => {
        setVisible(true);
      },
      closeModal: async () => {
        await handleClose();
      },
    }));

    useEffect(() => {
      // Reset status to null on every render
      setStatus(null);
    });

    const handleSubmit = async () => {
      
      if (fromDate && toDate) {
        await onFinish({ status, fromDate, toDate }).catch((error) => {
          console.error("Unhandled promise rejection:", error);
        });
          // Close the modal regardless of the form validation
        handleClose();
      } else {
        // Display an error message if From Date and To Date are not selected
        await message.error("Please select From Date and To Date");
      }

    
      
    };

    return (
      <div>
        <Modal
          title="Export to Excel"
          visible={visible}
          onCancel={handleClose}
          footer={[
            <Button key="cancel" className="btn btn-outline-primary" onClick={handleClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="From Date"
                  name="fromDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select From Date",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "95%" }}
                    value={fromDate}
                    format={DATE_FORMAT}
                    onChange={(date) => setFromDate(date)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="To Date"
                  name="toDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select To Date",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "95%" }}
                    value={toDate}
                    format={DATE_FORMAT}
                    onChange={(date) => setToDate(date)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
);

export default ExportReportBox;
