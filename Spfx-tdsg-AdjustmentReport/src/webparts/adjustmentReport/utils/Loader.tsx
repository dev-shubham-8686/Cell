import * as React from "react";
import { Spin } from "antd";
//import "./Loader.css"; // Optional: for styling

const Loader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null; // Do not render if loading is false

  return (
    <div className="loader-container">
      <Spin size="large" />
    </div>
  );
};

export default Loader;
