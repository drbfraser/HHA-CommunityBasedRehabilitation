import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { Link } from "react-router-dom";
import { IPage } from "util/pages";
import { useStyles } from "./SideNav.styles";

interface IProps {
    page: IPage;
    active: boolean;
}

const SideNavIcon = ({ page, active }: IProps) => {
    const styles = useStyles();

    // fix issue with findDOMNode in strict mode
    const NoTransition = ({ children }: any) => children;

    return (
        <Link to={page.path}>
            <Tooltip
                title={page.name}
                placement="top"
                arrow
                classes={{ tooltip: styles.tooltip }}
                TransitionComponent={NoTransition}
            >
                <div className={styles.icon + (active ? ` ${styles.active}` : "")}>
                    {page.Icon && <page.Icon fontSize="large" />}
                </div>
            </Tooltip>
        </Link>
    );
};

export default SideNavIcon;
