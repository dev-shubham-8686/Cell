import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import { APP_NAME, WEB_URL } from "../../GLOBAL_CONSTANT";
import { redirectToHome } from "../../utility/utility";
const ApprovalHome: React.FC = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  useEffect(() => {
    const url = window.location.href;
    const [baseUrl, hashString] = url.split("#/");
    const [_, queryString] = url.split("?");
    const params = new URLSearchParams(queryString);
    const ctValue = params.get("CT");
    const orValue = params.get("OR");
    const cidValue = params.get("CID");
    const lastPart = hashString?.split("/").pop(); 
    if (ctValue || orValue || cidValue){
      if (lastPart === "approverListing") {
        window.location.href = `${WEB_URL}/SitePages/${APP_NAME}#/approverListing`
      } else if(lastPart === "approval") {
        window.location.href = `${WEB_URL}/SitePages/${APP_NAME}#/form/${mode}/${id}/approval`;
      }
    }
    else
     { 
      if (lastPart === "approverListing") {
        navigate(`/`, {
          state: { currentTabState: "myapproval-tab" },
        })
      } 
      else if(lastPart === "approval"){
      navigate(`/form/${mode}/${id}`, {
        state: { isApproverRequest: true },
      });}
    }
  }, []);
  return (  
    <div className="error-boundary">
      {" "}
      <img
        src={require("../../assets/ban.png")}
        alt="Apologetic image"
        className="d-inline-block align-text-top"
      />{" "}
      <p className="mb-0 fw-semibold font-20 text-black">
        {" "}
        Please wait, while we&apos;re redirecting you.{" "}
      </p>{" "}
      <p>
        {" "}
        <span
          onClick={() => redirectToHome()}
          className="cursor-pointer text-danger text-decoration-underline"
        >
          {" "}
          Click Here{" "}
        </span>{" "}
        to go to homepage.{" "}
      </p>{" "}
      <Spin spinning={true} fullscreen />{" "}
    </div>
  );
};
export default ApprovalHome;
