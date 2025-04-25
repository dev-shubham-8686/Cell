import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useContext,
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
  Spin,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { EXCEL_DATE_FORMAT } from "../../GLOBAL_CONSTANT";
import useExportToExcel from "../../hooks/useExportToExcel";

const { Option } = Select;

interface ExportReportBoxProps {
  buttonText: string;
  onCancel: () => void;
  // onFinish: (values: any) => Promise<void>;
}

const ExportReportBox = forwardRef(
  ({ buttonText, onCancel }: ExportReportBoxProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState<string | null>(null); // Initialize status as null
    const [fromDate, setFromDate] = useState<Date | null>(null); // Set fromDate type to Date | null
    const [toDate, setToDate] = useState<Date | null>(null); // Set toDate type to Date | null
    const [form] = useForm();
    interface StatusOption {
      label: string;
      value: string;
    }
    const location = useLocation();
    const { isApproverRequest, currentTabState } = location.state || {};
    const { mutate: exportToExcelListing, isLoading: excelLoading } = useExportToExcel()
    const { user } = useUserContext();
    const handleClose = () => {
      setVisible(false);
      setStatus(null);
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
      setStatus(null);
    });
    const handleSubmit = async () => {
      if (fromDate && toDate) {
        const formattedFromDate = dayjs(fromDate).format(
          EXCEL_DATE_FORMAT
        );
        const formattedToDate = dayjs(toDate).format(EXCEL_DATE_FORMAT);
        exportToExcelListing({
          fromdate: formattedFromDate,
          toDate: formattedToDate,
          id: user?.employeeId,
          tab: currentTabState === "myapproval-tab" ? 3 : currentTabState === "allrequest-tab" ? 2 : currentTabState === "myrequest-tab" ? 1 : 0,
        });
        handleClose()
      } else {
        await message.error("Please select From Date and To Date");
      }
    };

    // Disable future dates for "From Date"
    const disabledFromDate = (current: any) => {
      return current && current > dayjs().endOf("day"); // Disable future dates
    };

    // Disable dates for "To Date" (must be greater than "From Date" and less than or equal to current date)
    const disabledToDate = (current: any) => {
      return (
        current &&
        (current < dayjs(fromDate).startOf("day") || current > dayjs().endOf("day"))
      );
    };

    return (
      <div>
        <Spin spinning={false} fullscreen />

        <Modal
          title="Export to Excel"
          visible={visible}
          onCancel={handleClose}
          footer={[
            <Button key="cancel" className="btn btn-outline-primary" onClick={handleClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" className="btn btn-primary" onClick={handleSubmit}>
              Export
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
                    format={"DD-MM-YYYY"}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={disabledFromDate}
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
                    format={"DD-MM-YYYY"}
                    onChange={(date) => setToDate(date)}
                    disabledDate={disabledToDate}
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
