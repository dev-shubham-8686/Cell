import * as React from "react";
import { Link } from "react-router-dom";
import { IUser, UserContext } from "../../context/userContext";

interface IHeader {
  title: string;
}

const Header: React.FC<IHeader> = ({ title }) => {
    const user: IUser = React.useContext(UserContext);
  
  return (
    <header className="header">
    <nav className="navbar border-bottom-1">
      <div className="container-fluid justify-content-between align-items-center px-0 mx-2rem">
        <p className="title">{title}</p>
        {
        // user?.isAdmin
        true ?<Link
        to="/master"
            className=""
          >
            MASTER
          </Link>:<></>}
      </div>
    </nav>
  </header>
  );
};

export default Header;
