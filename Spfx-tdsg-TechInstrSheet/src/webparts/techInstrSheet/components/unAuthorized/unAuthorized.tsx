import * as React from "react";

export const UnAuthorized: React.FC = () => (
  <div
   className="UnAuthorized"
    style={{
      height: "30vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    You do not have access to the application, please contact administrator
  </div>
);

export default UnAuthorized;
