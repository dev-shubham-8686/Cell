import * as React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";

interface IPageLayout {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<IPageLayout> = ({ title, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <h4 className="pl-10 pb-1 title text-[#c50017] uppercase">
      Technical Instructions
      </h4>
      <Layout
        style={{ minHeight: "30vh" }}
        className="border-0 border-t border-solid border-gray-200"
      >
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <Layout>
          <Header
            className="bg-white border-0 border-b border-solid border-gray-200"
            style={{ padding: 0 }}
          >
            <Button
              type="text"
              icon={
                isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <span className="title text-[#c50017] uppercase">{title}</span>
          </Header>
          <div className="p-6 bg-white">{children}</div>
        </Layout>
      </Layout>
    </>
  );
};

export default PageLayout;
