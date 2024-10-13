import React from "react";
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { pagesForUser } from "../../util/pages";
import { useStyles } from "./SideNav.styles";
import SideNavIcon from "./SideNavIcon";
import { Box } from "@mui/material";
import { mediaMobile } from "theme.styles";

const SideNav = () => {
    const user = useCurrentUser();
    const styles = useStyles();
    const { pathname } = useLocation();

    // todo: finish moving styles into sx?
    return (
        <Box
            sx={{
                // container
                display: "flex",
                flexDirection: "column",
                width: 100,
                [mediaMobile]: {
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "100%",
                },
            }}
        >
            <Box
                component="img"
                src="/images/hha_icon_white.png"
                alt=""
                sx={{
                    // hhaIcon
                    margin: "10px auto 30px auto",
                    borderRadius: 20,
                    height: 75,
                    width: 75,
                    padding: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    [mediaMobile]: {
                        display: "none",
                    }
                }}
            />
            {pagesForUser(user)
                .filter((page) => page.showInNav)
                .map((page) => (
                    <SideNavIcon key={page.path} page={page} active={page.path === pathname} />
                ))}
        </Box>
    );
};

export default SideNav;
