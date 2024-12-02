import { message, notification } from "antd";
import { MessageType } from "antd/es/message/interface";
import * as React from "react";

const displayErrorNoti = (msg: string, desc: string): void => {
  notification.error({
    message: msg,
    description: <div>{desc}</div>,
  });
};

export const Message = {
  showError: (text: string) =>
    message.error({
      content: text,
      duration: 5,
      className: "error-msg",
    }),
  showSuccess: (text: string) =>
    message.success({
      content: text,
      duration: 5,
      className: "success-msg",
    }),
  showInfo: (text: string) =>
    message.info({
      content: text,
      duration: 5,
      className: "info-msg",
    }),
};

export const showErrorMsg = (text: string): MessageType => {
  return message.error({
    content: text,
    duration: 5,
    className: "error-msg",
  });
};
export const showSuccess = (text: string): MessageType => {
  return message.success({
    content: text,
    duration: 5,
    className: "success-msg",
  });
};
export const showInfo = (text: string): MessageType => {
  return message.info({
    content: text,
    duration: 5,
    className: "info-msg",
  });
};

export default {
  displayErrorNoti,
  showErrorMsg,
  showSuccess,
  showInfo,
};
