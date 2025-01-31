import * as React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

interface IHeader {
  title: string;
}

const Header: React.FC<IHeader> = ({ title }) => {
    const { user } = useUserContext();
    const url=location.pathname;
    console.log("ADMINBUTTTTTONN",location)
  return (
    
    <header className="header">
    <nav className="navbar border-bottom-1">
    <div className="container-fluid justify-content-between align-items-center  mx-2rem px-3 py-2"
      style={{borderBottom:"1px Solid lightgray"}}>   
           <p className="title m-0 px-2">{title}</p>
        {
         (user?.isAdmin && title === "Adjustment Report Dashboard")? 
        (<Link
        to="/master"
        className="px-3 py-1"
        style={{textDecoration:"none", backgroundColor:"rgba(255,0,0,0.1)",borderRadius:"4px",fontWeight:"600",}}          >
            Master Configuration
            </Link>):(<></>)}
      </div>
    </nav>
  </header>
  );
};

export default Header;
