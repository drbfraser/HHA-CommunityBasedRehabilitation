import { LinearProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import { doLogout } from "@cbr/common/util/auth";

const Logout = () => {
    useEffect(() => {
        doLogout();
        window.location.reload();
    });
    return <LinearProgress />;
};

export default Logout;
