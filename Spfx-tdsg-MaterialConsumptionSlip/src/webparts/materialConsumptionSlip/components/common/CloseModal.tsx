import { Input, Radio, Button, Modal, message, Form, Spin } from "antd";
import React, { useContext, useState } from "react";
import useClose, { ICloseRequestPayload } from "../../apis/close/useClose";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { FormContext } from "antd/es/form/context";
import { FormProvider } from "react-hook-form";
import FormItem from "antd/es/form/FormItem";

interface CloseModalProps {
  setmodalVisible: React.Dispatch<React.SetStateAction<boolean>> ;
  visible: boolean;
}

const CloseModal: React.FC<CloseModalProps> = ({ setmodalVisible, visible }) => {
  const { id } = useParams();
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"scrap" | "noScrap" >("scrap");
  const [scrapTicketNo, setScrapTicketNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const closeRequest = useClose();

  const onClose =()=>{
    
    form.resetFields();
    setmodalVisible(false);
    setStatus("scrap")
  }
  const handleConfirm = () => {
  

    if (status === "scrap" && !scrapTicketNo) {
      void message.error("Please enter Scrap Ticket No.");
      return;
    }

    if (status === "noScrap" && !remarks) {
      void message.error("Please enter remarks.");
      return;
    }
    const payload: ICloseRequestPayload = {
      isScraped: status === "scrap" ? true : false,
      MaterialConsumptionId: parseInt(id),
      scrapRemarks: remarks,
      scrapTicketNo: scrapTicketNo,
      userId: user.employeeId,
    };
    closeRequest.mutate(payload, {
      onSuccess: (Response) => {
        
        console.log("Close req Response: ", Response);
        navigate(`/material-consumption-slip`);
      },
      
      onError: (error) => {
        console.error("Export error:", error);
      },

    });
    onClose();
  };
  return (
    <>
    <Modal
      title="Select an Option"
      visible={visible}
      onCancel={onClose}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <Button
            key="cancel"
            className="btn-outline-primary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            key="confirm"
            className="btn btn-primary"
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
            style={{ marginBottom: "6px" }}
          >
            Confirm
          </Button>
        </>
      )}
    >
  
{console.log("Status",status)
}      <Form form={form} onFinish={handleConfirm}>
        <Form.Item
          name="status"
          // rules={[
          //   {
          //     required: true,
          //     message: "Please select an option.",
          //   },
          // ]}
        >
          <Radio.Group
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            defaultValue={"scrap"}
          >
            <Radio value="scrap">Scrap</Radio>
            <Radio value="noScrap">No Scrap</Radio>
          </Radio.Group>
        </Form.Item>

        {status === "scrap" && (
          <Form.Item
          rules={[
            {
              required: true,
              message: "Please enter a Scrap Ticket No.",
            },
          ]}
            name="scrapTicketNo"
          >
            <Input
              id="scrapTicketNo"
              maxLength={100}
              value={scrapTicketNo}
              onChange={(e) => setScrapTicketNo(e.target.value)}
              placeholder="Please enter Scrap Ticket No"
            />
          </Form.Item>
        )}

        {status === "noScrap" && (
          <Form.Item
            name="remarks"
            rules={[
              {
                required: true,
                message: "Please enter remarks.",
              },
            ]}
          >
            <Input.TextArea
              id="remarks"
              rows={5}
              maxLength={500}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Please enter Remarks"
            />
          </Form.Item>
        )}
       
      </Form>
     
    </Modal>
     <Spin spinning={(closeRequest.isLoading)} fullscreen />
     </>
  );
};

export default CloseModal;
