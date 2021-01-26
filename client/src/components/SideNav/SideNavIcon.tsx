import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { Link } from "react-router-dom";
import { IPage } from "util/pages";
import styles from "./SideNav.module.css";

interface IProps {
    page: IPage;
    active: boolean;
}

const SideNavIcon = ({ page, active }: IProps) => {
    const NavTooltip = (props: OverlayInjectedProps) => (
        <Tooltip id="sidenav-tooltip" {...props} className={props.show ? "show" : ""}>
            {page.name}
        </Tooltip>
    );

    return (
        <Link to={page.path}>
            <OverlayTrigger transition={false} placement="top" overlay={NavTooltip}>
                {
                    /* Have to use this in function form to avoid bad rerenders
                    (https://github.com/react-bootstrap/react-bootstrap/issues/5519) */
                    ({ ref, ...triggerHandler }) => (
                        <div
                            ref={ref}
                            {...triggerHandler}
                            className={styles.icon + (active ? ` ${styles.active}` : "")}
                        >
                            <i className={`fa fa-fw fa-${page.icon}`}></i>
                        </div>
                    )
                }
            </OverlayTrigger>
        </Link>
    );
};

export default SideNavIcon;
