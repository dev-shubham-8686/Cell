import React from "react";
import { redirectToHome } from "../../utils/utility";

const NotFound: React.FC = () => {
  return (
    <div className="error-bounday">
      <img
        src={require("../../assets/picture_apology.png")}
        alt="Apologetic image"
        className="d-inline-block align-text-top"
      />
      <p className="mb-0 fw-semibold font-20 text-black">
        The specified page is not accessible.
      </p>
      <p>The URL may be incorrect.</p>
      <p>
        <span
          onClick={() => redirectToHome()}
          className="cursor-pointer text-danger text-decoration-underline"
        >
          Click Here
        </span>{" "}
        to go to homepage.
      </p>
    </div>
  );
};

export default NotFound;
