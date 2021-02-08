import React from "react";
import { useLocation } from "react-router-dom";
import { pages } from "../../util/pages";
import { useStyles } from "./SideNav.styles";
import SideNavIcon from "./SideNavIcon";

const SideNav = () => {
    const styles = useStyles();
    const { pathname } = useLocation();

    return (
        <div className={styles.container}>
            <img src="/images/hha_icon_white.png" alt="" className={styles.hhaIcon} />
            {pages
                .filter((page) => page.showInNav)
                .map((page) => (
                    <SideNavIcon key={page.path} page={page} active={page.path === pathname} />
                ))}
        </div>
    );
};

export default SideNav;
