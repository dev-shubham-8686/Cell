import * as React from "react";

type UnAuthorizedProps = {};
export const UnAuthorized: React.FC<UnAuthorizedProps> = () => {
  return (
    <>
      <div className="error-bounday">
        <img
          src={require("../../assets/ban.png")}
          alt="Unauthorized"
          className="d-inline-block align-text-top mb-3"
          height={84}
          width={84}
        />
        {/* <i className="fa-solid fa-ban" /> */}
        <p className="mb-0 fw-semibold font-20 text-black">
          You do not have access to the application!
        </p>
        <p className="font-18">Please contact your administrator.</p>
      </div>
    </>
  );
};

export default UnAuthorized;
