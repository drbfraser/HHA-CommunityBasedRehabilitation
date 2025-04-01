import { IUser } from "@cbr/common/util/users";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    open: boolean;
    onClose: () => void;
    users: IUser[];
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

const StatsUserFilter = ({ open, onClose, users, user, setUser }: IProps) => {
    const { t } = useTranslation();
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
            <DialogTitle>{t("statistics.filterByUser")}</DialogTitle>

            <DialogContent>
                <Autocomplete
                    options={users}
                    value={selectedUser}
                    onChange={(_e, v) => setSelectedUser(v)}
                    getOptionLabel={renderUser}
                    // NOTE: if issues, see Autocomplete changes from https://mui.com/material-ui/migration/v5-component-changes/
                    // renderOption={renderUser}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label={t("general.user")}
                            name="userId"
                            variant="outlined"
                        />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClear}>{t("general.clear")}</Button>
                <Button color="primary" onClick={handleSubmit}>
                    {t("general.filter")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsUserFilter;
