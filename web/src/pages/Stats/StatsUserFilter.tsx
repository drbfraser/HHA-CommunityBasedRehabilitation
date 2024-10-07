import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { IUser } from "@cbr/common/util/users";
import { Autocomplete } from '@mui/material';
import { AutocompleteRenderInputParams } from '@mui/lab';

interface IProps {
    open: boolean;
    onClose: () => void;
    users: IUser[];
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

const StatsUserFilter = ({ open, onClose, users, user, setUser }: IProps) => {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(user);
    const renderUser = (u?: IUser) => (u ? `${u.first_name} ${u.last_name} (${u.username})` : "");

    const handleSubmit = () => {
        setUser(selectedUser);
        onClose();
    };

    const handleClear = () => {
        setSelectedUser(null);
        setUser(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Filter by User</DialogTitle>
            <DialogContent>
                <Autocomplete
                    options={users}
                    value={selectedUser}
                    onChange={(e, v) => setSelectedUser(v)}
                    getOptionLabel={renderUser}
                    renderOption={renderUser}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextField
                            {...params}
                            fullWidth
                            name="userId"
                            label="User"
                            variant="outlined"
                        />
                    )}
                />
                <br />
                <br />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClear}>Clear</Button>
                <Button color="primary" onClick={handleSubmit}>
                    Filter
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsUserFilter;
