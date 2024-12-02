import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, DatePicker, Form, Row, Col, Spin } from "antd";
import dayjs from "dayjs";
import { technicalExcelListing } from "../../api/technicalInstructionApi";
import { UserContext } from "../../context/userContext";
import { downloadExcelFileListing } from "../../api/utility/utility";
//import Loader from "../../utils/Loader";
//import axios from "axios"; // Import axios for API calls
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import displayjsx from "../../utils/displayjsx";

interface ExportToExcelProps {
  type: string;
}

dayjs.extend(isSameOrAfter);

const ExportToExcel = forwardRef(({ type }: ExportToExcelProps, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  //const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [form] = Form.useForm();
  const user = React.useContext(UserContext);
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
      setExcelLoading(true);
      const values = await form.validateFields();
      const fromDate = values.fromDate
        ? dayjs(values.fromDate).format("YYYY-MM-DD")
        : "";
      const toDate = values.toDate
        ? dayjs(values.toDate).format("YYYY-MM-DD")
        : "";
      //console.log(fromDate);
      //console.log(toDate);
      technicalExcelListing(
        fromDate,
        toDate,
        user?.employeeId.toString() ?? "",
        type
      )
        .then((data) => {
          setExcelLoading(false);
          // Trigger file download from the response
          downloadExcelFileListing(data.ReturnValue);
          void displayjsx.showSuccess("File downloaded successfully.");
        })
        .catch((err) => {
          setExcelLoading(false);
          console.log(err);
        });
      // Call the API to export data with the selected dates
      //await exportDataToExcel(fromDate, toDate);

      setIsModalVisible(false);
      form.resetFields(); // Reset form after submission
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <>
      <Spin spinning={excelLoading} fullscreen />
      <Modal
        title="Export to Excel"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={excelLoading}
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
                  { required: true, message: "Please select the From Date" },
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
                  { required: true, message: "Please select the To Date" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const fromDate = getFieldValue("fromDate");
                      if (
                        !value ||
                        !fromDate ||
                        dayjs(value).isSameOrAfter(fromDate)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "To Date must be equal to or greater than From Date"
                        )
                      );
                    },
                  }),
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
