import * as React from "react";
import { ChangeEvent, FC } from "react";
import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";

const ColumnFilter: FC<FilterDropdownProps> = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
  close,
}) => {
  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        value={selectedKeys[0]}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSelectedKeys(e.target.value ? [e.target.value.replace(/\s+/g, '')] : [])
        }
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setSelectedKeys([]);
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  );
};

export default ColumnFilter;
