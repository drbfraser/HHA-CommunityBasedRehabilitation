import { Badge } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IPage } from "util/pages";
import { useStyles } from "./SideNav.styles";
import { IAlert } from "@cbr/common/util/alerts";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { Alert } from "@mui/material";
import { socket } from "@cbr/common/context/SocketIOContext";
import { IUser } from "@cbr/common/util/users";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { mediaMobile } from "theme.styles";

interface IProps {
    page: IPage;
    active: boolean;
}

const SideNavIcon = ({ page, active }: IProps) => {
    const styles = useStyles();
    // fix issue with findDOMNode in strict mode
    const NoTransition = ({ children }: any) => children;
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
    const [isUnreadAlertCountSet, setIsUnreadAlertCountSet] = useState<boolean>(false);

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
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>;
            } else {
                let unreadAlerts: IAlert[] = alertsList.filter((alert: IAlert) =>
                    alert.unread_by_users.includes(user.id)
                );
                setUnreadAlertsCount(unreadAlerts.length);
            }
        } catch (e) {
            console.log(`Error fetching Alerts: ${e}`);
        }
    };

    useEffect(() => {
        if (!isUnreadAlertCountSet) {
            fetchAlerts();
            setIsUnreadAlertCountSet(true);
        }
    }, [isUnreadAlertCountSet]);

    function IconInfo(props: any) {
        return (
            <Link to={props.page.path}>
                <Tooltip
                    title={props.page.name}
                    placement="top"
                    arrow
                    // classes={{ tooltip: styles.tooltip }}
                    // todo: sx replaces classes here?
                    sx={{
                        // tooltip
                        fontSize: 14,
                        "&, & .MuiTooltip-arrow:before": {
                            backgroundColor: "black",
                        },
                    }}
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
            sx={{
                // notificationBadge
                justifyContent: "center",
                "& .MuiBadge-badge": {
                    right: 20,
                    top: 15,
                },
                [mediaMobile]: {
                    "& .MuiBadge-badge": {
                        right: 10,
                    },
                }
            }}
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
