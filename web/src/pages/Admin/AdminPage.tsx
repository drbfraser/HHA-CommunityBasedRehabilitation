import React from "react";
import AdminList from "../AdminList/AdminList";
import ZoneList from "../ZoneList/ZoneList";
import { Tabs, Tab, Box } from "@mui/material";
import { Typography } from "@material-ui/core";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const AdminPage = () => {
    const [value, setValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
                    <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs">
                        <Tab label="Users" {...a11yProps(0)} />
                        <Tab label="Zones" {...a11yProps(1)} />
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
