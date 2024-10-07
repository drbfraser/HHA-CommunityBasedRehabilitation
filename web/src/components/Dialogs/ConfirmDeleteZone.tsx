import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { FormControl } from "@mui/material";
import { Endpoint, apiFetch } from "@cbr/common/util/endpoints";
interface IResponseRow {
    id: number;
    zone_name: number;
}
export default function ConfirmDeleteZone(props: any) {
    const { zoneId, users, clients, open, setOpen, handleDeleteZone } = props;
    const [contentText, setContentText] = React.useState<string>("");
    const [selectedZone, setSelectedZone] = React.useState<string>();
    const [zones, setZones] = React.useState<IResponseRow[]>([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState<boolean>(false);
    // const [open, setOpen] = React.useState<boolean>(false);
    React.useEffect(() => {
        const getZones = async () => {
            const resp = await apiFetch(Endpoint.ZONES);

            const responseRows: IResponseRow[] = await resp.json();
            const allZones = responseRows.map((responseRow) => {
                return {
                    id: responseRow.id,
                    zone_name: responseRow.zone_name ?? "",
                };
            });
            setZones(allZones);
        };
        getZones();

        var userList = "";
        if (users && users.length !== 0) {
            userList += "Users: ";
            for (const user of users) {
                userList += user.username;
                if (user === users[users.length - 1]) {
                    userList += ".";
                } else userList += ", ";
            }
        }

        var clientList = "";
        if (clients && clients.length !== 0) {
            clientList += "Clients: ";
            for (const client of clients) {
                clientList += client.full_name;
                if (client === clients[clients.length - 1]) {
                    clientList += ".";
                } else clientList += ", ";
            }
        }

        var inZone = userList + " " + clientList;
        setContentText(
            "Zone cannot be deleted because the following users/clients and their associated past visits are still in zone -\n " +
                inZone +
                "\n Select a zone to move these users and clients to: "
        );
    }, [users, clients]);

    const handleSelectZone = (event: any) => {
        setSelectedZone(event.target.value as string);
    };

    const handleSave = async () => {
        return await apiFetch(Endpoint.ZONE_MIGRATION, `${zoneId}/${selectedZone}`).then(
            async (res) => {
                if (!res.ok) {
                    alert(
                        "Encountered an error while trying to migrate users and clients to target zone!"
                    );
                } else {
                    setOpen(false);
                    setConfirmDeleteOpen(true);
                }
            }
        );
    };
    return (
        <div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Zone cannot be deleted</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {contentText}
                    </DialogContentText>
                </DialogContent>
                <FormControl fullWidth style={{ padding: 20 }}>
                    <InputLabel id="demo-simple-select-label">
                        Move Users And Clients To Zone
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedZone}
                        label="Zone"
                        onChange={handleSelectZone}
                    >
                        {Array.from(zones).map(
                            (zone) =>
                                zone.id !== zoneId && (
                                    <MenuItem key={zone.id} value={zone.id}>
                                        {zone.zone_name}
                                    </MenuItem>
                                )
                        )}
                    </Select>
                </FormControl>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Delete Zone</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Users and clients successfully migrated. Delete zone?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleDeleteZone(zoneId)} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
