import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from '@mui/material/Button';
import { priorities } from "@cbr/common/util/alerts";
import MenuItem from "@material-ui/core/MenuItem";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { Field, Form, Formik } from "formik";
import FormControl from "@material-ui/core/FormControl";
import {
  fieldLabels,
  FormField,
  initialValues,
  validationSchema,
} from "@cbr/common/forms/Alert/alertFields";

const handleSubmit = () => {};

const priority = () => {
  return [];
}

const AlertForm = () => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          <Grid container justify="center" alignItems="flex-start">
            <Grid md={12} xs={12}>
              <Grid container direction="row" justify="flex-start" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Field
                    component={TextField}
                    name={FormField.subject}
                    variant="outlined"
                    label={fieldLabels[FormField.subject]}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item md={4} xs={6}>
                  <FormControl fullWidth variant="outlined">
                    <Field
                      component={TextField}
                      name={FormField.priority}
                      variant="outlined"
                      label={fieldLabels[FormField.priority]}
                      required
                      fullWidth
                      select
                    >
                      {Object.entries(priorities).map(
                        ([value, name]) => (
                            <MenuItem key={value} value={value}>
                                {name}
                            </MenuItem>
                        )
                      )}
                    </Field>
                  </FormControl>
                </Grid>

                <Grid item md={12} xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    multiline
                    rows={12}
                    required
                    variant="outlined"
                    label={fieldLabels[FormField.body]}
                    name={FormField.body}
                  />
                </Grid>
              
                <Grid item md={12} xs={12}>
                  <Grid container md={12} xs={12}>
                    <Grid item md={8} xs={4}>
                      <Button variant="outlined" color="error">Discard</Button>
                    </Grid>
                    <Grid container md={4} xs={8} justify="flex-end">
                      <Button variant="outlined" color="primary">Save</Button>
                      &nbsp;
                      <Button variant="outlined" color="success">Send</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>  
          </Grid>  
        </Formik>
    );
};

export default AlertForm;
