import { LinearProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import { doLogout } from "util/auth";

const Logout = () => {
    useEffect(() => doLogout());
    return <LinearProgress />;
};

export default Logout;
