import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const StatsUserFilter = (props: IProps) => {
    const initialValues = {
        from: "",
        to: "",
    };

    const handleSubmit = () => {};

    return (
        <Dialog open={props.open}>
            <DialogTitle>Filter by Date</DialogTitle>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                    <DialogContent>
                        <Field
                            component={TextField}
                            label="From"
                            variant="outlined"
                            type="date"
                            requred
                            InputLabelProps={{ shrink: true }}
                        />
                        <br />
                        <br />
                        <Field
                            component={TextField}
                            label="From"
                            variant="outlined"
                            type="date"
                            requred
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.onClose}>Clear Filter</Button>
                        <Button color="primary" variant="outlined" onClick={props.onClose}>
                            Filter
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    );
};

export default StatsUserFilter;
