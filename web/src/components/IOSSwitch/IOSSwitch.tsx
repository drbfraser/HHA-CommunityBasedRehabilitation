import React from "react";
import { Switch, SwitchProps } from "@material-ui/core";
import { useStyles } from "./IOSSwitch.styles";

const IOSSwitch = (props: SwitchProps) => {
    const styles = useStyles();

    return (
        <Switch
            focusVisibleClassName={styles.focusVisible}
            disableRipple
            classes={{
                root: styles.root,
                switchBase: styles.switchBase,
                thumb: styles.thumb,
                track: styles.track,
                checked: styles.checked,
            }}
            {...props}
        />
    );
};

export default IOSSwitch;
