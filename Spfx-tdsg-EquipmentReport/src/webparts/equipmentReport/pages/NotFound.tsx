import { FrownOutlined } from "@ant-design/icons";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-[200px]">
      <div>
        <FrownOutlined style={{ color: "#1a3d6e", fontSize: "3rem" }} />
      </div>
      <div>
        <strong>Not Found</strong>
      </div>
    </div>
  );
};

export default NotFound;
