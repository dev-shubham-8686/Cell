import { FrownOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div
      className="p-4"
      style={{
        height: "30vw",
      }}
    >
      <div className="d-flex h-100 flex-column gap-2 justify-content-center align-items-center ">
        <FrownOutlined style={{ color: "#1a3d6e", fontSize: "3rem" }} />

        <strong>Not Found</strong>
        <p>
          <Link to="/">Click here to go back to homepage.</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
