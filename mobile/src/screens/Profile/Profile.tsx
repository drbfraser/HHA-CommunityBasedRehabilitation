import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import UserProfileContents from "../../components/UserProfileContents/UserProfileContents";

const Profile = () => {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;

    return <UserProfileContents user={user} isSelf={true} />;
};

export default Profile;
