import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FunctionComponent = () => {
  const location = useLocation();

  const toggleSidebar = (): void => {
    const element = document.getElementById("mySidebar");
    const elementToggler = document.getElementById("myToggler");
    element?.classList.toggle("hide");
    elementToggler?.classList.toggle("hide");
  };

  const TITLE: { [key: string]: string } = {
    "/form": "Trouble Report Form",
    "/": "Trouble Report Dashboard",
    "/add": "Trouble Report Form",
    "/master-management": "Master Management",
    "/master-management/troubletype": "Trouble Type",
    "/master-management/category": "Category",
    "/master-management/material": "Material",
    "/master-management/uom": "Unit of Measure",
  };

  const displayTitle = (path: string): string => {
    if (path === "/") return "Trouble Report Dashboard";
    else if (path.startsWith("/form")) return "Trouble Report Form";

    // for (const key in TITLE) {
    //   if (path.startsWith(key)) {
    //     return TITLE[key];
    //   }
    // }
    return "Trouble Report";
  };

  return (
    <header className="header">
      <nav className="navbar border-bottom-1">
        <div className="container-fluid justify-content-start align-items-center px-0 mx-2rem">
          {/* <a className="navbar-brand p-2" href="#">
            <img
              src={require("../../assets/logo.png")}
              alt="Logo"
              className="d-inline-block align-text-top logo"
            />
          </a> */}
          {/* <a
            id="myToggler"
            onClick={toggleSidebar}
            className="toggler d-flex justify-content-center align-items-center rounded p-1 me-3"
          >
            <i className="fa-solid fa-bars-staggered" />
            <i className="fa-solid fa-chevron-left" />
          </a> */}
          <p className="title">{displayTitle(location.pathname)}</p>
        </div>
      </nav>
    </header>
  );
};

export default Header;
