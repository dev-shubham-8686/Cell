import { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, DatePicker, Form, Row, Col } from "antd";
import Loader from "../../utils/Loader";
import { useUserContext } from "../../context/UserContext";
import * as dayjs from "dayjs";
import * as React from "react";
import { downloadExcelFileListing } from "../../utils/utility";
import { useGetAdjustmentExcelListing } from "../../hooks/useGetAdjustmentExcelListing";
//import axios from "axios"; // Import axios for API calls

interface ExportToExcelProps {
  type: string;
}

const ExportToExcel = forwardRef(({ type }: ExportToExcelProps, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const user = useUserContext();
  // Expose some methods to the parent via ref
  useImperativeHandle(ref, () => ({
    openModal() {
      setIsModalVisible(true);
    },
    closeModal() {
      setIsModalVisible(false);
    },
  }));

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form on cancel
  };

  //   const exportDataToExcel = async (fromDate: string, toDate: string) => {
  //     try {
  //       // Replace this URL with your actual API endpoint
  //       const apiUrl = `/api/export-to-excel?fromDate=${fromDate}&toDate=${toDate}`;

  //       // Make an API call using axios
  //       const response = await axios.get(apiUrl, {
  //         responseType: "blob", // Set the response type for downloading files
  //       });

  //       // Trigger file download from the response
  //       const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
  //       const downloadUrl = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = downloadUrl;
  //       a.download = `export_${fromDate}_to_${toDate}.xlsx`;
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //     } catch (error) {
  //       console.error("Error exporting data to Excel:", error);
  //     }
  //   };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const fromDate = values.fromDate
        ? dayjs(values.fromDate).format("YYYY-MM-DD")
        : "";
      const toDate = values.toDate
        ? dayjs(values.toDate).format("YYYY-MM-DD")
        : "";
      //console.log(fromDate);
      //console.log(toDate);
      const response = useGetAdjustmentExcelListing(
        fromDate,
        toDate,
        user?.user?.EmployeeId?.toString() ?? "",
        type
      )
      downloadExcelFileListing(response.data?.ReturnValue);

      // Call the API to export data with the selected dates
      //await exportDataToExcel(fromDate, toDate);

      setIsModalVisible(false);
      form.resetFields(); // Reset form after submission
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} /> {/* Show loader */}
      <Modal
        title="Export to Excel"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="From Date"
                name="fromDate"
                rules={[
                  { required: true, message: "Please select the from date" },
                ]}
              >
                <DatePicker style={{ width: "95%" }} format={"DD-MM-YYYY"} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="To Date"
                name="toDate"
                rules={[
                  { required: true, message: "Please select the to date" },
                ]}
              >
                <DatePicker style={{ width: "95%" }} format={"DD-MM-YYYY"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
});

export default ExportToExcel;
