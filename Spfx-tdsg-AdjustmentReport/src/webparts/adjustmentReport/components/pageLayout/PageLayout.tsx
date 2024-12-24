import * as React from "react";
import { Layout } from "antd";
import Header from "../common/header";

interface IPageLayout {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<IPageLayout> = ({ title, children }) => {
  return (
    <>
      
        <Header title={title} />
          <div className="p-6 bg-white">{children}</div>
          
 
    </>
  );
};

export default PageLayout;
