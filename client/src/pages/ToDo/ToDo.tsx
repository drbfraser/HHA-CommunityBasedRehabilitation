import React from "react";
import { Divider, Typography } from "@material-ui/core";
import ConnectionTest from "./ConnectionTest";
import FormExample from "./FormExample/FormExample";

const ToDo = () => {
    return (
        <div>
            <Typography variant="body1">
                Page not yet written. In the mean time, have a test page :)
            </Typography>
            <br />
            <ConnectionTest />
            <br />
            <Divider />
            <br />
            <Typography variant="body1">
                Here is an example form using Material UI + Formik + Yup for validation. It also
                uses the Grid component to resize nicely for different screen sizes - take a look at
                what happens if you resize your browser window:
            </Typography>
            <br />
            <FormExample />
        </div>
    );
};

export default ToDo;
