import React from "react";
import { styled, Switch, SwitchProps } from "@mui/material";
import { themeColors } from "@cbr/common/util/colors";

// adapted from https://mui.com/material-ui/react-switch/ examples
const IOSStyleSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "150ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: themeColors.yellow,
                opacity: 1,
                border: 0,
                ...theme.applyStyles("dark", {
                    backgroundColor: "#2ECA45",
                }),
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
            },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: themeColors.yellow,
            border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color: theme.palette.grey[100],
            ...theme.applyStyles("dark", {
                color: theme.palette.grey[600],
            }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.7,
            ...theme.applyStyles("dark", {
                opacity: 0.3,
            }),
        },
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: themeColors.yellow,
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 150,
        }),
        ...theme.applyStyles("dark", {
            backgroundColor: "#39393D",
        }),
    },
}));

const IOSSwitch = (props: SwitchProps) => {
    return <IOSStyleSwitch sx={{ mx: 1 }} {...props} />;
};

export default IOSSwitch;
