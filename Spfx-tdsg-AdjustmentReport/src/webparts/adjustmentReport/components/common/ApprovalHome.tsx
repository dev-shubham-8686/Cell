import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import { redirectToHome } from "../../utils/utility";
import { APP_NAME, WEB_URL } from "../../GLOBAL_CONSTANT";
const ApprovalHome: React.FC = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  useEffect(() => {
    const url = window.location.href;
    const [_, queryString] = url.split("?");
    const params = new URLSearchParams(queryString);
    const ctValue = params.get("CT");
    const orValue = params.get("OR");
    const cidValue = params.get("CID");
    if (ctValue || orValue || cidValue)
      window.location.href = `${WEB_URL}/SitePages/${APP_NAME}#/form/${mode}/${id}/approval`;
    else
      navigate(`/request/${mode}/${id}`, {
        state: { isApproverRequest: true, fromApprovalEmail: true },
      });
  }, []);
  return (
    <div className="error-boundary">
      {" "}
      <img
        src={require("../assets/picture_apology.png")}
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
