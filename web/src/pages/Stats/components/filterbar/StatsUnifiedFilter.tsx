import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { FilterLabels } from "./FilterBar";

import StatsUserFilter from "./StatsUserFilter";
import StatsDateFilter from "./StatsDateFilter";
import StatsDemographicFilter from "./StatsDemographicFilter";
import { IUser } from "@cbr/common/util/users";
import { IGender, IAge } from "./StatsDemographicFilter";
import { IDateRange } from "./StatsDateFilter";

interface IProps {
    open: boolean;
    onClose: () => void;
    users: IUser[];
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    dateRange: IDateRange;
    setDateRange: (range: IDateRange) => void;
    gender: IGender;
    age: IAge;
    setGender: (gender: IGender) => void;
    setAge: (age: IAge) => void;
    archiveMode: boolean;
    onArchiveModeChange: (checked: boolean) => void;
}

const StatsUnifiedFilter = ({
    open,
    onClose,
    users,
    user,
    setUser,
    dateRange,
    setDateRange,
    gender,
    age,
    setGender,
    setAge,
    archiveMode,
    onArchiveModeChange,
}: IProps) => {
    const { t } = useTranslation();
    const [tab, setTab] = React.useState(0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{"Filter"}</DialogTitle>

            <Box sx={{ px: 3, pb: 1 }}>
                <FilterLabels>
                    <menu>
                        <Typography
                            color={archiveMode ? "textSecondary" : "textPrimary"}
                            component="span"
                            variant="body2"
                        >
                            {t("statistics.allClients")}
                        </Typography>
                        <IOSSwitch
                            checked={archiveMode}
                            onChange={(e) => onArchiveModeChange(e.target.checked)}
                        />
                        <Typography
                            color={archiveMode ? "textPrimary" : "textSecondary"}
                            component="span"
                            variant="body2"
                        >
                            {t("statistics.activeClients")}
                        </Typography>
                    </menu>
                </FilterLabels>
            </Box>

            <DialogContent dividers>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
                    <Tab label="Filter by Demographic" />
                    <Tab label="Filter by Date" />
                    <Tab label="Filter by User" />
                </Tabs>

                {tab === 0 && (
                    <StatsDemographicFilter
                        gender={gender}
                        age={age}
                        setGender={setGender}
                        setAge={setAge}
                        compact
                    />
                )}
                {tab === 1 && <StatsDateFilter range={dateRange} setRange={setDateRange} />}
                {tab === 2 && <StatsUserFilter users={users} user={user} setUser={setUser} />}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{t("general.close")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsUnifiedFilter;
