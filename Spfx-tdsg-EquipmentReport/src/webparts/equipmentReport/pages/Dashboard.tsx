import * as React from "react";
import RequestSection from "../components/Dashboard/RequestSection";
import ApprovalSection from "../components/Dashboard/ApprovalSection";

const Dashboard = () => {
  return (
    <div>
      <RequestSection />
      <ApprovalSection />
    </div>
  );
};

export default Dashboard;
