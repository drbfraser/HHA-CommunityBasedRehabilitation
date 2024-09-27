import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Tooltip from "@material-ui/core/Tooltip";

import { IAlert } from "@cbr/common/util/alerts";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { socket } from "@cbr/common/context/SocketIOContext";
import { IUser } from "@cbr/common/util/users";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { IPage } from "util/pages";
import { useStyles } from "./SideNav.styles";

interface IProps {
    page: IPage;
    active: boolean;
}

const SideNavIcon = ({ page, active: iconIsActive }: IProps) => {
    const styles = useStyles();
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
    const [isUnreadAlertCountSet, setIsUnreadAlertCountSet] = useState<boolean>(false);

    // fix issue with findDOMNode in strict mode
    const NoTransition = ({ children }: any) => children;

    socket.on("broadcastAlert", () => {
        fetchAlerts();
    });
    socket.on("updateUnreadList", (unreadAlertsCount) => {
        setUnreadAlertsCount(unreadAlertsCount);
    });

    const fetchAlerts = async () => {
        // Function fetches alerts to check how many unread alert's this user has and sets the state accordingly
        try {
            const alertsList = await (await apiFetch(Endpoint.ALERTS)).json();
            const user: IUser | typeof APILoadError = await getCurrentUser();

            if (user === APILoadError || user === undefined) {
                // TODO: translate
                // also not sure if this even does anything (its not being returned)
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>;
            } else {
                const unreadAlerts: IAlert[] = alertsList.filter((alert: IAlert) =>
                    alert.unread_by_users.includes(user.id)
                );
                setUnreadAlertsCount(unreadAlerts.length);
            }
        } catch (e) {
            console.error(`Error fetching Alerts: ${e}`);
        }
    };

    useEffect(() => {
        if (!isUnreadAlertCountSet) {
            fetchAlerts();
            setIsUnreadAlertCountSet(true);
        }
    }, [isUnreadAlertCountSet]);

    function IconInfo(props: any) {
        const { path, name, Icon } = props.page;

        return (
            <Link to={path}>
                <Tooltip
                    title={name}
                    placement="top"
                    arrow
                    classes={{ tooltip: styles.tooltip }}
                    TransitionComponent={NoTransition}
                >
                    <div className={`${styles.icon} ${iconIsActive ? styles.active : ""}`}>
                        {Icon && <Icon fontSize="large" />}
                    </div>
                </Tooltip>
            </Link>
        );
    }

    return page.name === "screenNames.inbox" ? (
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
