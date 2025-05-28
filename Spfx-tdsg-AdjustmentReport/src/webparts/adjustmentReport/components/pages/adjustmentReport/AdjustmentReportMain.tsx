import * as React from "react";
// import PageLayout from "../../pageLayout/PageLayout";
import { Button, Tabs, TabsProps } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import MyRequest from "./MyRequest";
import MyApproval from "./MyApproval";
import AllRequest from "./AllRequest";
import PageLayout from "../../pageLayout/PageLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../../context/UserContext";

const AdjustmentReportMain: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();

  const currentTabState = location.state?.currentTabState || "myrequest-tab";

  const onAddRequest = () => {
    navigate("/form/add");
  };

  const getKeyFromTabState = (tabState: string): string => {
    switch (tabState) {
      case "myapproval-tab":
        return "2";
      case "allrequest-tab":
        return "3";
      default:
        return "1";
    }
  };

  const handleTabChange = (key: string) => {
    navigate("/", {
      state: {
        currentTabState:
          key == "1"
            ? "myrequest-tab"
            : key == "2"
              ? "myapproval-tab"
              : key == "3"
                ? "allrequest-tab"
                : "",
      },
    });
  };

  React.useEffect(() => {
    if (user?.isITSupportUser && !user?.isAdmin) {
      handleTabChange("3");
    }
  }, [user]);

  const operations = (
    <>
      {/* <Button
        type="primary"
        onClick={() => navigate("/master")}
        style={{ float: "right" }}
      >
        MASTER
      </Button> */}
      {!user?.isITSupportUser && <Button
        type="primary"
        className="btn btn-primary mb-8"
        onClick={() => onAddRequest()}
        icon={
          <span style={{ marginRight: "5px" }}>
            <FontAwesomeIcon className="me-1 mt-50" icon={faCirclePlus} />
          </span>
        }
      >
        New Request
      </Button>}
    </>
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "My Requests",
      children: <MyRequest />,

      // <AdjustmentReportRequests />
    },
    {
      key: "2",
      label: "My Approvals",
      children: <MyApproval />,
      // <AdjustmentReportApprovals />
    },
    {
      key: "3",
      label: "All Requests",
      children: <AllRequest />,
    },
  ];

  if (user?.isITSupportUser && !user?.isAdmin) {
    items.shift();
    items.shift();
  }

  return (
    // <Page title="Equipment Improvement Dashboard">
    <PageLayout title={"Adjustment Report Dashboard"}>
      <div>
        <div className="p-6">
          <Tabs
            tabBarExtraContent={operations}
            items={items}
            onChange={handleTabChange}
            activeKey={getKeyFromTabState(currentTabState)}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AdjustmentReportMain;
