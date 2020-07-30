import React from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { FilterFramesRounded, ContactsRounded } from "@material-ui/icons";
import QLogo from "../../../Images/QLogo.png";
import "./NavigationBreadcrumbs.scss";

const NavigationBreadcrumbsUser = () => {
    const currentPage = window.location.pathname;
    return (
        <div className="Navigation-Breadcrumbs-Wrapper">
            <div style={{ marginLeft: 5 }}>
                <img style={{ width: 50, height: 50 }} src={QLogo} alt="QLoto" />
            </div>
            <Breadcrumbs separator={<div className={"Separator"}>||</div>} className="Breadcrumbs">
                <Link
                    href="/evaluations"
                    className={currentPage === "/evaluations" ? "LinkBold" : "Link"}
                >
                    <FilterFramesRounded className="Icon" fontSize="small" />
                    Evaluations
                </Link>

                <Link
                    href="/credentials"
                    className={currentPage === "/credentials" ? "LinkBold" : "Link"}
                >
                    <ContactsRounded className="Icon" fontSize="small" />
                    Credentials
                </Link>

            </Breadcrumbs>
            <div style={{ marginTop: 5, marginRight: 5 }}>
                {window.localStorage.getItem("name")}
                <br />
                <a style={{ color: "#ce2b27" }} onClick={() => window.localStorage.clear()} href="/">Log Out</a>
            </div>
        </div>
    );
};

export default NavigationBreadcrumbsUser;
