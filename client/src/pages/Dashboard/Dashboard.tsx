import React, { useEffect, useState } from "react";
import { FormControl, Divider, MenuItem, Select, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { getAllZones, IZone } from "util/cache";

const Dashboard = () => {
    const [zones, setZones] = useState<IZone[]>([]);
    const [zoneSelected, setZoneSelected] = useState<string | number>("");

    useEffect(() => {
        getAllZones().then((zones) => {
            setZones(zones);

            if (zones.length) {
                setZoneSelected(zones[0].id);
            }
        });
    }, []);

    return (
        <>
            <Alert severity="info">
                <Typography variant="body1">
                    <b>System:</b> Welcome! Unfortunately, the dashboard is not yet fully
                    functional. We have been prioritizing work on clients, risk history, visits and
                    referrals instead.
                </Typography>
            </Alert>
            <br />
            <Alert severity="info">
                <Typography variant="body1">
                    <b>System:</b> Eventually the dashboard will show notifications sent by admins
                    (like this one!) and high-priority clients.
                </Typography>
            </Alert>
            <br />
            <Divider />
            <br />
            <div>
                <Typography variant="h5" component="span">
                    Show high-priority clients from &nbsp;
                </Typography>
                <FormControl variant="outlined" style={{ verticalAlign: "baseline" }}>
                    <Select
                        value={zoneSelected}
                        onChange={(e) => setZoneSelected(e.target.value as number)}
                    >
                        {zones.map((zone) => (
                            <MenuItem key={zone.id} value={zone.id}>
                                {zone.zone_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </>
    );
};

export default Dashboard;
