import { withStyles } from "@material-ui/core/styles";
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

    const NavTooltip = withStyles({
        tooltip: {
            fontSize: 16,
        },
    })(Tooltip);

    return (
        <Link to={page.path}>
            <NavTooltip title={page.name} placement="top">
                <div className={styles.icon + (active ? ` ${styles.active}` : "")}>
                    {page.Icon && <page.Icon fontSize="large" />}
                </div>
            </NavTooltip>
        </Link>
    );
};

export default SideNavIcon;
