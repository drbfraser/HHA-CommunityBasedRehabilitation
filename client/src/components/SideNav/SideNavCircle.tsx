import React from "react";
import { Link } from "react-router-dom";
import { IPage } from "util/pages";
import styles from "./SideNav.module.css";

interface IProps {
    page: IPage;
    active: boolean;
}

const SideNavCircle = ({ page, active }: IProps) => {
    return (
        <Link to={page.path}>
            <div className={styles.circle + (active ? ` ${styles.active}` : "")}>
                <i className={`fa fa-${page.icon}`}></i>
            </div>
        </Link>
    );
};

export default SideNavCircle;
