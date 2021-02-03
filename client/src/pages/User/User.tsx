import React, { useState } from "react";
import View from "pages/User/View";
import Edit from "pages/User/Edit";

const User = () => {
    const [toggleView, setToggleView] = useState(true);
    const switchComponent = () => {
        setToggleView(toggleView);
    };

    return (
        <div>
            {toggleView ? <View setProps={switchComponent} /> : <Edit setProps={switchComponent} />}
        </div>
    );
};

export default User;
