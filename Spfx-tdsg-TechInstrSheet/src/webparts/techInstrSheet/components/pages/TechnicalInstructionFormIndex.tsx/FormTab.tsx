import * as React from "react";
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Upload,
  Select,
  Button,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { previewFile } from "../../../api/fileUploadApi";
import { DOCUMENT_LIBRARIES } from "../../../GLOBAL_CONSTANT";
import { toolbarButtons } from "../../editor/Toolbar";
import FroalaEditor from "react-froala-wysiwyg";
const { Option } = Select;

const FormTab: React.FC<any> = ({
  form,
  onFinish,
  initialData,
  isViewMode,
  equipments,
  handleUpload,
  handleRemove,
  fileList,
  technicalOutlineFileList,
  ctiNumber,
  intialFolderName,
  handleOutlineUpload,
  handleOutlineRemove,
  setEditorModel,
  editorModel,
  outlineImageFiles,
  setoutlineImageFiles,
  showOtherField,
  setShowOtherField,
  otherEquipment,
  setOtherEquipment,
  handleChangeEquipment,
}) => {
  const [model, setModel] = React.useState<string>("");
  const [imageFiles, setImageFiles] = React.useState<any>([]);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;

    // Function to update the z-index of all '.fr-popup' elements
    const updateZIndex = () => {
      if (isMountedRef.current) {
        document.querySelectorAll(".fr-popup").forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.zIndex = "2147483647"; // Ensure TypeScript recognizes 'style'
          }
        });
      }
    };

    // Create a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver((mutations) => {
      if (isMountedRef.current) {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            updateZIndex();
          }
        });
      }
    });

    // Start observing the body or a specific container for child additions
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function once initially
    updateZIndex();

    // Cleanup function to disconnect the observer and mark as unmounted
    return () => {
      isMountedRef.current = false; // Mark as unmounted
      observer.disconnect(); // Stop observing DOM changes
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  // Handle image insertion
  const handleImageInsert = function (image: any) {
    const newImageFile = image[0].currentSrc;
    if (isMountedRef.current) {
      setImageFiles((prevFiles: any) => [...prevFiles, newImageFile]);
      setoutlineImageFiles((prevFiles: any) => [...prevFiles, newImageFile]);
    }
  };

  // Handle image removal
  const handleImageRemoved = (image: any) => {
    const newImageFile = image[0].currentSrc;
    if (isMountedRef.current) {
      setImageFiles((prevFiles: any) =>
        prevFiles.filter((f: any) => f !== newImageFile)
      );
      setoutlineImageFiles((prevFiles: any) =>
        prevFiles.filter((f: any) => f !== newImageFile)
      );
    }
  };

  // Log updated imageFiles after state change
  React.useEffect(() => {
    if (isMountedRef.current) {
      console.log("Updated image files:", imageFiles);
    }
  }, [imageFiles]); // Run when imageFiles changes

  const myconfig = {
    placeholderText: "Enter Outline",
    key: "1C%kZV[IX)_SL}UJHAEFZMUJOYGYQE[\\ZJ]RAe(+%$==", // Replace with your Froala key.
    toolbarButtons: isViewMode == true ? [] : toolbarButtons,
    events: {
      "image.inserted": handleImageInsert,
      "image.removed": handleImageRemoved,
      initialized: function () {
        if (isViewMode) {
          this.edit.off(); // Turn off all editing features
          this.$el.attr("contenteditable", false); // Ensure content is not editable at the DOM level
        }
      },
    },
    attribution: false,
    //imageUpload: false, // Disable auto-upload.
  };

  const handleModelChange = (value: any) => {
    if (isMountedRef.current) {
      setModel(value);
      setEditorModel(value);
    }
  };

  React.useEffect(() => {
    if (isMountedRef.current) {
      setModel(editorModel);
    }
  }, [editorModel]);

  // const [showOtherField, setShowOtherField] = React.useState(false);
  // const [otherEquipment, setOtherEquipment] = React.useState("");
  // const handleChange = (value: any) => {
  //   // Check if "Other" is selected
  //   debugger;
  //   if (value.includes("other")) {
  //     setShowOtherField(true);
  //     form.setFieldsValue({
  //       equipmentIds: ["other"],
  //       otherEquipment: "",
  //     }); // Reset the "Other" input field
  //   } else {
  //     setShowOtherField(false);
  //     form.setFieldsValue({
  //       equipmentIds: value,
  //       otherEquipment: null, // Clear "Other" input field in form when not needed
  //     });
  //   }
  //   setOtherEquipment("");
  // };

  return (
    <div>
      {/* Form tab content */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialData}
      >
        <Row gutter={1}>
          <Col span={6}>
            <Form.Item
              label="Issue Date"
              name="issueDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "95%" }}
                format="DD-MM-YYYY"
                placeholder="Select Date"
                disabledDate={(current) =>
                  current && current < dayjs().endOf("day")
                }
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Issued By"
              name="issuedBy"
              rules={[{ required: true }]}
            >
              <Input
                style={{ width: "95%" }}
                placeholder="Requestor Name"
                disabled={true}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="CTI Number"
              name="ctiNumber"
              //rules={[{ required: true }]}
            >
              <Input
                style={{ width: "95%" }}
                //value={`CTI-${dayjs().year()}-001`}
                disabled
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Revision No." name="revisionNo">
              <Input style={{ width: "95%" }} disabled={true} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={1}>
          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, max: 1000 }]}
            >
              <Input.TextArea
                style={{ width: "95%" }}
                maxLength={1000}
                placeholder="Enter Title"
                disabled={isViewMode}
                rows={3}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Purpose"
              name="purpose"
              rules={[{ required: true, max: 1000 }]}
            >
              <Input.TextArea
                style={{ width: "95%" }}
                maxLength={1000}
                placeholder="Enter Purpose"
                disabled={isViewMode}
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={1}>
          <Col span={12}>
            <Form.Item
              label="Product Type"
              name="productType"
              rules={[{ required: true, max: 50 }]}
            >
              <Input
                style={{ width: "95%" }}
                maxLength={50}
                placeholder="Enter Product Type"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "95%" }}
                //min={0}
                //step={0.01}
                precision={2} // Limit to two decimal places
                placeholder="Enter Quantity"
                disabled={isViewMode}
                controls={false} // Hide the up/down buttons
                onBlur={(e) => {
                  const value = Number(e.target.value); // Convert to number
                  if (value < 0) {
                    form.setFieldsValue({ quantity: null });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={1}>
          <Col span={24}>
            <Form.Item
              label="Outline"
              name="outline"

              //rules={[{ required: true, max: 1000 }]}
            >
              <div className="editor-container" style={{ width: "100%" }}>
                <FroalaEditor
                  tag="textarea"
                  config={myconfig}
                  model={model}
                  onModelChange={handleModelChange}
                />
              </div>
              {/* <Input.TextArea
                style={{ width: "95%" }}
                maxLength={1000}
                placeholder="Enter outline"
                disabled={isViewMode}
                rows={1}
              /> */}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={1}>
          {/* <Col span={8}>
            <Form.Item
              label="Outline Attachment"
              name="technicalOutlineAttachmentAdd"
            >
              <Upload
                className={isViewMode ? "upload-red-only" : ""}
                style={{ width: "95%" }}
                multiple
                beforeUpload={handleOutlineUpload}
                // onRemove={(file) => {
                //   const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
                //   setFileList(newFileList);
                // }}
                onRemove={handleOutlineRemove}
                maxCount={5}
                disabled={isViewMode}
                fileList={technicalOutlineFileList}
                onPreview={(file) => {
                  if (file.status == "done") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${ctiNumber}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
                    );
                  } else if (intialFolderName != "") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${intialFolderName}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />} disabled={isViewMode}>
                  Upload Document
                </Button>
              </Upload>
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item
              label="TIS Applicability Date"
              name="tisApplicabilityDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "95%" }}
                format="DD-MM-YYYY"
                placeholder="Select Date"
                disabledDate={(current) =>
                  current && current < dayjs().endOf("day")
                }
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Closure Date"
              name="targetClosureDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "95%" }}
                format="DD-MM-YYYY"
                placeholder="Select Date"
                disabledDate={(current) =>
                  current && current < dayjs().endOf("day")
                }
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Related Document" name="technicalAttachmentAdds">
              <Upload
                className={isViewMode ? "upload-red-only" : ""}
                style={{ width: "95%" }}
                multiple
                beforeUpload={handleUpload}
                // onRemove={(file) => {
                //   const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
                //   setFileList(newFileList);
                // }}
                onRemove={handleRemove}
                maxCount={5}
                disabled={isViewMode}
                fileList={fileList}
                onPreview={(file) => {
                  if (file.status == "done") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${ctiNumber}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
                    );
                  } else if (intialFolderName != "") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${intialFolderName}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />} disabled={isViewMode}>
                  Upload Document
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          {/* <Col span={8}>
            <Form.Item label="Lot.No" name="lotNo">
              <Input
                style={{ width: "95%" }}
                placeholder="Enter Lot.No"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col> */}
        </Row>
        {/* <Row gutter={1}>
          
        </Row> */}

        <h3
          className="primary-color"
          style={{ marginTop: 0, fontSize: "1.125rem" }}
        >
          Application Timing
        </h3>
        <Row gutter={1}>
          <Col span={8}>
            <Form.Item label="Application Date" name="applicationStartDate">
              <DatePicker
                style={{ width: "95%" }}
                format="DD-MM-YYYY"
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Lot No."
              name="applicationLotNo"
              rules={[{ max: 100 }]}
              //rules={[{ required: true }]}
            >
              <Input
                style={{ width: "95%" }}
                placeholder="Enter Lot No."
                disabled={isViewMode}
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Equipment"
              name="equipmentIds"
              rules={[{ required: true }]}
            >
              <Select
                style={{ width: "95%" }}
                mode="multiple"
                placeholder="Select Equipment"
                allowClear
                disabled={isViewMode}
                onChange={handleChangeEquipment}
              >
                {/* Example options; replace with actual master data */}

                {equipments.map(
                  (eq: { EquipmentId: React.Key; EquipmentName: string }) => (
                    <Option
                      key={eq.EquipmentId}
                      value={eq.EquipmentId}
                      disabled={showOtherField}
                    >
                      {eq.EquipmentName}
                    </Option>
                  )
                )}

                {/* Add "Other" option */}
                <Option key="other" value="other">
                  Other
                </Option>
              </Select>
            </Form.Item>
            {/* Conditionally show the "Other" textbox */}
            {/* Conditionally render textbox for "Other" equipment */}
            {showOtherField && (
              <Form.Item
                name="otherEquipment"
                label="Other Equipment"
                style={{ width: "95%" }}
                rules={[
                  {
                    required: true,
                    max: 250,
                  },
                ]}
              >
                <Input
                  disabled={isViewMode}
                  placeholder="Enter Other Equipment"
                  value={otherEquipment}
                  onChange={(e) => setOtherEquipment(e.target.value)}
                />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormTab;
