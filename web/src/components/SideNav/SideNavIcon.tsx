import { Badge } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IPage } from "util/pages";
import { useStyles } from "./SideNav.styles";
import { IAlert } from "../../../src/pages/AlertInbox/AlertList";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { Alert } from "@material-ui/lab";
import { socket } from "@cbr/common/context/SocketIOContext";

interface IProps {
    page: IPage;
    active: boolean;
}

const SideNavIcon = ({ page, active }: IProps) => {
    const styles = useStyles();
    // fix issue with findDOMNode in strict mode
    const NoTransition = ({ children }: any) => children;
    const user = useCurrentUser();
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);

    // Function fetches alerts to check how many unread alert's this user has and sets the state accordingly
    const updateUnreadAlertsNotification = async () => {
        let res = await fetchAlerts();
        if (res) {
            if (user === APILoadError || user === undefined) {
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>;
            } else {
                let unreadAlerts: IAlert[] = res.filter((alert) =>
                    alert.unread_by_users.includes(user.id)
                );
                setUnreadAlertsCount(unreadAlerts.length);
            }
        }
    };
    socket.on("broadcastAlert", () => {
        updateUnreadAlertsNotification();
    });

    socket.on("updateUnreadList", () => {
        updateUnreadAlertsNotification();
    });

    useEffect(() => {
        updateUnreadAlertsNotification();
    }, [user]);

    const fetchAlerts = async () => {
        try {
            const alertsList: IAlert[] = await (await apiFetch(Endpoint.ALERTS)).json();
            return alertsList;
        } catch (e) {
            console.log(`Error fetching Alerts: ${e}`);
        }
    };

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
            badgeContent={unreadAlertsCount}
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
