import * as React from "react";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";

interface IPageLayout {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<IPageLayout> = ({ title, children }) => {
  return (
    <>
      <Layout
        style={{ minHeight: "30vh" }}
        // className="border-0 border-t border-solid border-gray-200"
      >
        <Layout>
          <Header
            className="bg-white "
            style={{ borderBottom: "1px solid #d7dce4" }}
          >
            <span className="title text-[#c50017] uppercase">{title}</span>
          </Header>
          <div className="p-6 bg-white">{children}</div>
        </Layout>
      </Layout>
    </>
  );
};

export default PageLayout;
