import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import UserProfileContents from "../../components/UserProfileContents/UserProfileContents";
import { useDatabase } from "@nozbe/watermelondb/hooks";

const Profile = () => {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;
    const database = useDatabase();
    return <UserProfileContents user={user} isSelf={true} database={database} />;
};

export default Profile;
