import * as React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const DeleteFileModal = (fileName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: (
        <p>
          Do you want to permanently delete the file <strong>{fileName}</strong>
          ?
        </p>
      ),
      icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { className: "btn btn-primary mb-1" },
      cancelButtonProps: { className: "btn-outline-primary" },
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
      centered: true,
    });
  });
};

export default DeleteFileModal;
