import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar bg-white hide" id="mySidebar">
      <ul className="nav flex-column mb-10">
        <li className="nav-item ">
          <Link
            to={"/"}
            className={
              location.pathname.startsWith("/") ? "nav-link active" : "nav-link"
            }
            aria-current="page"
          >
            <i className="fa-solid fa-gauge" />
            <span className="link-name">Trouble Report</span>
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link
            to={"/equipment-improvement-report"}
            className={
              location.pathname.startsWith("/equipment-improvement-report")
                ? "nav-link active"
                : "nav-link"
            }
            aria-current="page"
          >
            <i className="a-solid fa-location-dot" />
            <span className="link-name">
              Application For Equipment Improvement
            </span>
          </Link>
        </li>
        {/*
        <li className="nav-item">
          <Link
            to={"/adjustment-report"}
            className={
              location.pathname.startsWith("/adjustment-report")
                ? "nav-link active"
                : "nav-link"
            }
            aria-current="page"
          >
            <i className="fa-solid fa-jet-fighter-up" />
            <span className="link-name">Adjustment Report</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={"/technical-instruction-report"}
            className={
              location.pathname.startsWith("/technical-instruction-report")
                ? "nav-link active"
                : "nav-link"
            }
            aria-current="page"
          >
            <i className="fa-solid fa-hotel" />
            <span className="link-name">Technical Instruction Sheet</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={"/material-consumption-report"}
            className={
              location.pathname.startsWith("/material-consumption-report")
                ? "nav-link active"
                : "nav-link"
            }
            aria-current="page"
          >
            <i className="fa-solid fa-car" />
            <span className="link-name">Material Consumption Slip</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={"/master-management"}
            className={
              location.pathname.startsWith("/master-management")
                ? "nav-link active"
                : "nav-link"
            }
            aria-current="page"
          >
            <i className="fa-solid fa-list-check"></i>{" "}
            <span className="link-name">Master Management</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
{
  /* <li className="nav-item">
          <Link
            to={"/scrap-note"}
            className={location.pathname === "/scrap-note" ? "nav-link active" : "nav-link"}
            aria-current="page"
          >
            <i className="fa-solid fa-gauge" />
            <span className="link-name">Scrap Note</span>
          </Link>
        </li> */
}
