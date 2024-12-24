import { message } from "antd";

export const showErrorNotification = (text: string): void => {
  void message.error({
    content: text,
    duration: 5,
    className: "error-msg",
  });
};

export const showSuccessNotification = (text: string): void => {
  void message.success({
    content: text,
    duration: 5,
    className: "success-msg",
  });
};

export const showInfoNotification = (text: string): void => {
  void message.info({
    content: text,
    duration: 5,
    className: "info-msg",
  });
};
