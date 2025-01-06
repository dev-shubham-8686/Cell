import * as React from "react";
import { Link } from "react-router-dom";

interface IHeader {
  title: string;
}

const Header: React.FC<IHeader> = ({ title }) => {
  return (
    <header className="header">
    <nav className="navbar border-bottom-1">
      <div className="container-fluid justify-content-between align-items-center px-0 mx-2rem">
        <p className="title">{title}</p>
        {<Link
        to="/master"
            className=""
          >
            MASTER
          </Link>}
      </div>
    </nav>
  </header>
  );
};

export default Header;
