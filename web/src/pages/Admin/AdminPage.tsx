import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import AdminList from "../AdminList/AdminList";
import ZoneList from "../ZoneList/ZoneList";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
});

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {value === index && (
            <Box sx={{ p: 3 }}>
                <Typography component="div">{children}</Typography>
            </Box>
        )}
    </div>
);

const AdminPage = () => {
    const { t } = useTranslation();
    const [value, setValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
                    <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs">
                        <Tab label={t("general.users")} {...a11yProps(0)} />
                        <Tab label={t("general.zones")} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <AdminList />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <ZoneList />
                </TabPanel>
            </Box>
        </div>
    );
};

export default AdminPage;
