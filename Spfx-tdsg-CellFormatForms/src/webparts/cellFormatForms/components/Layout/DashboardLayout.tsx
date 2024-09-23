import React from "react";
import Header from "../Common/Header";
// import Sidebar from "../Common/Sidebar";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main d-flex h-100 flex-grow-1">
        {/* <Sidebar /> */}
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default DashboardLayout;
