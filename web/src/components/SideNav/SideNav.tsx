import React from "react";
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { pagesForUser } from "../../util/pages";
import { sideNavStyles } from "./SideNav.styles";
import SideNavIcon from "./SideNavIcon";
import { Box } from "@mui/material";

const SideNav = () => {
    const user = useCurrentUser();
    const { pathname } = useLocation();

    return (
        <Box
            sx={sideNavStyles.container}
        >
            <Box
                component="img"
                src="/images/hha_icon_white.png"
                alt=""
                sx={sideNavStyles.hhaIcon}
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
