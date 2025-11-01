import { IUser } from "@cbr/common/util/users";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    users: IUser[];
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

const StatsUserFilter = ({ users, user, setUser }: IProps) => {
    const { t } = useTranslation();
    const [selectedUser, setSelectedUser] = useState<IUser | null>(user);

    const renderUser = (u?: IUser) => (u ? `${u.first_name} ${u.last_name} (${u.username})` : "");

    const handleSubmit = () => {
        setUser(selectedUser);
    };

    const handleClear = () => {
        setSelectedUser(null);
        setUser(null);
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Autocomplete
                options={users}
                value={selectedUser}
                onChange={(_e, v) => setSelectedUser(v)}
                getOptionLabel={renderUser}
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

            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
                <Button onClick={handleClear}>{t("general.clear")}</Button>
                <Button color="primary" variant="contained" onClick={handleSubmit}>
                    {t("general.filter")}
                </Button>
            </Box>
        </Box>
    );
};

export default StatsUserFilter;
