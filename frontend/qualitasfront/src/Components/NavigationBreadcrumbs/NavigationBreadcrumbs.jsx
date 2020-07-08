import React from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { PeopleRounded, DashboardRounded, AssignmentTurnedInOutlined, ArchiveOutlined, WorkRounded, GroupWorkOutlined } from "@material-ui/icons";
import "./NavigationBreadcrumbs.scss";

const NavigationBreadcrumbs = () => {
    const currentPage = window.location.pathname;
    return (
        <div className="Navigation-Breadcrumbs-Wrapper">
                        <Breadcrumbs separator={<div className={"Separator"}>||</div>} className="Breadcrumbs">
                <Link
                    href="/projects"
                    className={currentPage === "/projects" ? "LinkBold" : "Link"}
                >
                    <WorkRounded className="Icon" fontSize="small" />
                    Projects
                </Link>
                <Link
                    href="/teams"
                    className={currentPage === "/teams" ? "LinkBold" : "Link"}
                >
                    <GroupWorkOutlined className="Icon" fontSize="small"/>
                    Teams
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
                <Link
                    href="/users"
                    className={currentPage === "/users" ? "LinkBold" : "Link"}
                >
                    <PeopleRounded className="Icon" fontSize="small" />
                    Users
                </Link>
                <Link
                    href="/archives"
                    className={currentPage === "/archives" ? "LinkBold" : "Link"}
                >
                    <ArchiveOutlined className="Icon" fontSize="small" />
                    Archives
                </Link>
            </Breadcrumbs>
            <div>
                <a onClick={() => window.localStorage.clear()} href="/">Log Out</a>
            </div>
        </div>
    );
};

export default NavigationBreadcrumbs;
