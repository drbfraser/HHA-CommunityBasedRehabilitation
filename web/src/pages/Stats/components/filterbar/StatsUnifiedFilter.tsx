import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Divider,
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pb: 0 }}>{"Filters"}</DialogTitle>

            <Box sx={{ pl: 3, pt: 1, pb: 2 }}>
                <FilterLabels sx={{ m: 0, p: 0 }}>
                    <menu
                        style={{
                            margin: 0,
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
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

            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        {t("statistics.filterByDemographic")}
                    </Typography>
                    <StatsDemographicFilter
                        gender={gender}
                        age={age}
                        setGender={setGender}
                        setAge={setAge}
                        compact
                    />
                </Box>

                <Divider />

                <Box>
                    <Typography variant="h6" gutterBottom>
                        {t("statistics.filterByDate")}
                    </Typography>
                    <StatsDateFilter range={dateRange} setRange={setDateRange} />
                </Box>

                <Divider />

                <Box>
                    <Typography variant="h6" gutterBottom>
                        {t("statistics.filterByUser")}
                    </Typography>
                    <StatsUserFilter users={users} user={user} setUser={setUser} />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{t("general.close")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsUnifiedFilter;
