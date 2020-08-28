import React from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { DashboardRounded, AssignmentTurnedInOutlined, WorkRounded } from "@material-ui/icons";
import QLogo from "../../../Images/QLogo.png";
// import "./NavigationBreadcrumbs.scss";

const NavigationBreadcrumbsClient = () => {
    const currentPage = window.location.pathname;
    return (
        <div className="Navigation-Breadcrumbs-Wrapper">
            <div style={{ marginLeft: 5, marginBottom: 5, marginTop: 5 }}>
                <img style={{ width: 50, height: 50 }} src={QLogo} alt="QLoto" />
            </div>
            <Breadcrumbs separator={<div className={"Separator"}>||</div>} className="Breadcrumbs">
                <Link
                    href="/projects"
                    className={currentPage === "/projects" ? "LinkBold" : "Link"}
                >
                    <WorkRounded className="Icon" fontSize="small" />
                    Projects
                </Link>

                <Link
                    href="/templates"
                    className={currentPage === "/templates" ? "LinkBold" : "Link"}
                >
                    <DashboardRounded className="Icon" fontSize="small" />
                    Templates
                </Link>
                <Link
                    href="/reports"
                    className={currentPage === "/reports" ? "LinkBold" : "Link"}
                >
                    <AssignmentTurnedInOutlined className="Icon" fontSize="small" />
                    Reports
                </Link>
            </Breadcrumbs>
            <div style={{ marginTop: 5, marginRight: 5 }}>
                {window.localStorage.getItem("name")}
                <br />
                <a style={{ color: "#DAA1A0" }} onClick={() => window.localStorage.clear()} href="/">Log Out</a>
            </div>
        </div>
    );
};

export default NavigationBreadcrumbsClient;
