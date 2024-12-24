import * as React from "react";

interface IHeader {
  title: string;
}

const Header: React.FC<IHeader> = ({ title }) => {
  return (
    <header className="header">
    <nav className="navbar border-bottom-1">
      <div className="container-fluid justify-content-start align-items-center px-0 mx-2rem">
        <p className="title">{title}</p>
      </div>
    </nav>
  </header>
  );
};

export default Header;
