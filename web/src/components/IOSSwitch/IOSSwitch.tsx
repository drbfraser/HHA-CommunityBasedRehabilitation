import React from "react";
import { Switch, SwitchProps } from "@mui/material";
import { iOSSwitchStyles } from "./IOSSwitch.styles";

const IOSSwitch = (props: SwitchProps) => {

    return (
        <Switch
            focusVisibleClassName="" // todo: was {}, correct replacement?
            disableRipple
            // classes={{
            //     root: stylesiOSSwitchStyles.root,
            //     switchBase: styles.switchBase,
            //     thumb: styles.thumb,
            //     track: styles.track,
            //     checked: styles.checked,
            // }}
            sx={iOSSwitchStyles} // todo: are these being applied?
            {...props}
        />
    );
};

export default IOSSwitch;
