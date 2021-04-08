import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { IUser } from "util/users";

interface IProps {
    open: boolean;
    onClose: () => void;
    users: IUser[];
    user?: IUser;
    setUser: (user?: IUser) => void;
}

const StatsDateFilter = ({ open, onClose, users, user, setUser }: IProps) => {
    const userIdToUser = (id: number | string) => users.find((u) => u.id === Number(id));
    const renderUser = (u?: IUser) => (u ? `${u.first_name} (${u.username})` : "");

    const handleSubmit = (values: { userId: string }) => {
        setUser(userIdToUser(values.userId));
        onClose();
    };

    const handleClear = () => {
        setUser(undefined);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Filter by User</DialogTitle>
            <Formik initialValues={{ userId: String(user?.id) ?? "" }} onSubmit={handleSubmit}>
                <Form>
                    <DialogContent>
                        <Field
                            component={TextField}
                            variant="outlined"
                            fullWidth
                            select
                            SelectProps={{
                                renderValue: (id: number) => renderUser(userIdToUser(id)),
                            }}
                            label="User"
                            name="userId"
                        >
                            {users.map((u) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {renderUser(u)}
                                </MenuItem>
                            ))}
                        </Field>
                        <br />
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClear}>Clear</Button>
                        <Button color="primary" type="submit">
                            Filter
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    );
};

export default StatsDateFilter;
