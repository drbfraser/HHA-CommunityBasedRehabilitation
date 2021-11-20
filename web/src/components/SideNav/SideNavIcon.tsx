import { Badge } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useEffect, useState } from "react";
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

    function IconInfo(props: any) {
        return (
            <Link to={props.page.path}>
                <Tooltip
                    title={props.page.name}
                    placement="top"
                    arrow
                    classes={{ tooltip: styles.tooltip }}
                    TransitionComponent={NoTransition}
                >
                    <div className={styles.icon + (active ? ` ${styles.active}` : "")}>
                        {props.page.Icon && <props.page.Icon fontSize="large" />}
                    </div>
                </Tooltip>
            </Link>
        );
    }

    return page.name === "Inbox" ? (
        <Badge
            badgeContent={newAlertCount}
            max={9}
            className={styles.notificationBadge}
            color="error"
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <IconInfo page={page} />
        </Badge>
    ) : (
        <IconInfo page={page} />
    );
};

export default SideNavIcon;
