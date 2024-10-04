import * as React from "react";

type UnAuthorizedProps = {};
export const UnAuthorized: React.FC<UnAuthorizedProps> = () => {
  return (
    <>
       <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "30vw",
        }}
      >
        You do not have access to the application, please contact administrator
      </div>
    </>
  );
};

export default UnAuthorized;
