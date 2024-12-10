import * as React from "react";
import { Menu } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";

interface ISidebar {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<ISidebar> = ({ isSidebarOpen }) => {
  return (
    <Sider
      className="bg-white border-r"
      trigger={null}
      collapsible
      collapsed={isSidebarOpen}
    >
      <Menu
        className="pt-2 bg-white h-full custom-menu"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <FileExcelOutlined />,
            label: "Technical Instructions",
          },
        ]}
      />
    </Sider>
  );
};
export default Sidebar;
