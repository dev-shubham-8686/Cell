import * as dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";

export const disabledPastDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current >= dayjs().endOf("day");
};

export const disabledfutureDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};