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
import Autocomplete from '@mui/material/Autocomplete';
// import { AutocompleteRenderInputParams } from '@mui/lab'; // todo, needed?

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
                    // renderOption={renderUser} // todo: need this?  check output, and reformat if needed
                    // NOTE: see Autocomplete changes from https://mui.com/material-ui/migration/v5-component-changes/
                    renderInput={(params) => ( // todo: missing params type AutocompleteRenderInputParams?
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
