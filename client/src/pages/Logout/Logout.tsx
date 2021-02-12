import React, { useEffect } from "react";
import { doLogout } from "util/auth";

const Logout = () => {
    useEffect(() => doLogout());
    return <></>;
};

export default Logout;
