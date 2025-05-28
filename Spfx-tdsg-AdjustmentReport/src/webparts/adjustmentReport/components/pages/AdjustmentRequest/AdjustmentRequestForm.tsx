// import { UploadOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Col,
//   DatePicker,
//   Form,
//   Input,
//   Radio,
//   Row,
//   Select,
//   Upload,
// } from "antd";
// import * as React from "react";
// import * as dayjs from "dayjs";
// import { disabledDate } from "../../../utils/helper";
// // import { useLocation } from "react-router-dom";
// import ChangeRiskManagementForm from "./ChangeRiskManagementForm";
// import { useGetAllMachines } from "../../../hooks/useGetAllMachines";
// import useUser from "../../../api/User/useUser";
// import { useUserContext } from "../../../context/UserContext";

// const { TextArea } = Input;
// const { Option } = Select;

// interface AdjustmentRequestFormProps {
//   onFormSubmit: (values: any) => void;
// }

// const AdjustmentRequestForm = React.forwardRef(
//   (props: AdjustmentRequestFormProps, ref) => {
//     // const location = useLocation();

//     // const { requestNo } = location.state;
//     const [form] = Form.useForm();
//     const user = useUserContext();

//     const [formSections, setFormSections] = React.useState<number[]>([0]); // Initially, one form section
//     const [selectedValue, setSelectedValue] = React.useState<boolean | null>(
//       null
//     );

//     useUser(user?.Email);
//     const { data } = useGetAllMachines();

//     const onFinish = (values: any) => {
//       values.ChangeRiskManagementRequired = selectedValue;
//       props.onFormSubmit(values);
//     };

//     const handleChange = (e: any) => {
//       setSelectedValue(e.target.value);
//     };

//     // Function to add a new form section
//     const addFormSection = () => {
//       setFormSections((prevSections) => [...prevSections, prevSections.length]);
//     };

//     // Function to handle the file validation
//     const beforeUpload = (file: File) => {
//       const isJpgOrPng =
//         file.type === "image/jpeg" || file.type === "image/png";
//       if (!isJpgOrPng) {
//         console.error("You can only upload JPG or PNG file!");
//       }
//       const isLt10M = file.size / 1024 / 1024 < 10;
//       if (!isLt10M) {
//         console.error("Image must smaller than 10MB!");
//       }
//       return isJpgOrPng && isLt10M;
//     };

//     // Forward form instance to parent component
//     React.useImperativeHandle(ref, () => ({
//       submit: () => {
//         form.submit();
//       },
//     }));

//     const currentDateTime = dayjs();

//     return (
//       <div className="py-3 adj-form">
//         <Form
//           layout="vertical"
//           onFinish={onFinish}
//           form={form}
//           initialValues={{
//             dateTime: currentDateTime,
//             reportNo: "",
//           }}
//         >
//           <Row gutter={48}>
//             <Col span={6}>
//               <Form.Item label="Report No" name="reportNo">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={6}>
//               <Form.Item label="Requested By" name="requestedBy">
//                 <Input placeholder="Enter Your Name" />
//               </Form.Item>
//             </Col>

//             <Col span={6}>
//               <Form.Item
//                 label="Checked By"
//                 name="checkedBy"
//                 rules={[{ required: true }]}
//               >
//                 <Select placeholder="Select Checked By">
//                   <Option value={1}>Checked By 1</Option>
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col span={6}>
//               <Form.Item
//                 label="When"
//                 name="dateTime"
//                 rules={[{ required: true, message: "Please Select Date" }]}
//               >
//                 <DatePicker
//                   disabledDate={disabledDate}
//                   showTime
//                   placeholder="Date & Time"
//                   format="YYYY-MM-DD HH:mm:ss"
//                   className="bg-antdDisabledBg border-antdDisabledBorder w-full"
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={48}>
//             <Col span={6}>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Area"
//                     name="area"
//                     rules={[{ required: true }]}
//                   >
//                     <Select placeholder="Select Area">
//                       <Option value={1}>Area 1</Option>
//                       <Option value={2}>Area 2</Option>
//                       <Option value={3}>Area 3</Option>
//                     </Select>
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   {/* Observation */}
//                   <Form.Item
//                     label="Observation"
//                     name="observation"
//                     rules={[{ required: true }]}
//                   >
//                     <TextArea
//                       rows={4}
//                       maxLength={2000}
//                       placeholder="Enter your observation"
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col span={12}>
//                   <Form.Item
//                     label="Before Images"
//                     name="beforeImages"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please upload before images!",
//                       },
//                     ]}
//                   >
//                     <Upload
//                       accept=".jpg,.jpeg,.png"
//                       beforeUpload={beforeUpload}
//                       maxCount={5} // Max attachments
//                       showUploadList={{ showRemoveIcon: true }}
//                     //onRemove={}
//                     >
//                       <Button icon={<UploadOutlined />}>
//                         Upload Before Images
//                       </Button>
//                     </Upload>
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </Col>

//             {/* Machine Name */}
//             <Col span={6}>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Machine Name"
//                     name="machineName"
//                     rules={[{ required: true }]}
//                   >
//                     <Select placeholder="Select Machine Name">
//                       {data?.ReturnValue.map((item) => <Option value={item.MachineId}>{item.MachineName}</Option>)}
//                     </Select>
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Root Cause"
//                     name="rootCause"
//                     rules={[{ required: true }]}
//                   >
//                     <TextArea
//                       rows={4}
//                       maxLength={2000}
//                       placeholder="Describe the root cause"
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col span={12}>
//                   <Form.Item
//                     label="After Images"
//                     name="afterImages"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please upload after images!",
//                       },
//                     ]}
//                   >
//                     <Upload
//                       accept=".jpg,.jpeg,.png"
//                       beforeUpload={beforeUpload}
//                       maxCount={5} // Max attachments
//                       showUploadList={{ showRemoveIcon: true }}
//                     >
//                       <Button icon={<UploadOutlined />}>
//                         Upload After Images
//                       </Button>
//                     </Upload>
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </Col>

//             <Col span={6}>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Sub-Machine Name"
//                     name="subMachineName"
//                     rules={[{ required: true }]}
//                   >
//                     <Select placeholder="Select Sub-Machine Name">
//                       <Option value={1}>Sub-Machine 1</Option>
//                     </Select>
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Adjustment Description"
//                     name="adjustmentDescription"
//                     rules={[{ required: true }]}
//                   >
//                     <TextArea
//                       rows={4}
//                       maxLength={2000}
//                       placeholder="Describe the adjustment made"
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </Col>

//             <Col span={6}>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Describe Problem"
//                     name="describeProblem"
//                     rules={[{ required: true }]}
//                   >
//                     <TextArea
//                       rows={4}
//                       maxLength={2000}
//                       placeholder="Describe the problem"
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     label="Condition After Adjustment"
//                     name="conditionAfterAdjustment"
//                   >
//                     <TextArea
//                       rows={5}
//                       maxLength={2000}
//                       placeholder="Describe the condition after adjustment"
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>

//           <div>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <span style={{ marginRight: 16 }}>
//                 Change Risk Management Required ?
//               </span>
//               <Radio.Group onChange={handleChange} value={selectedValue}>
//                 <Radio value={true} style={{ marginRight: 16 }}>
//                   Yes
//                 </Radio>
//                 <Radio value={false}>No</Radio>
//               </Radio.Group>
//             </div>
//           </div>

//           {/* Render multiple form sections */}
//           {selectedValue &&
//             formSections.map((sectionIndex) => (
//               <ChangeRiskManagementForm
//                 form={form}
//                 key={sectionIndex}
//                 index={sectionIndex}
//               />
//             ))}
//           {/* Button to add new form section */}
//           {selectedValue && (
//             <div className="flex justify-end items-center my-3">
//               <div className="flex items-center gap-x-4">
//                 <Button type="primary" onClick={addFormSection}>
//                   Add Change Risk Management
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Form>
//       </div>
//     );
//   }
// );

// export default AdjustmentRequestForm;
