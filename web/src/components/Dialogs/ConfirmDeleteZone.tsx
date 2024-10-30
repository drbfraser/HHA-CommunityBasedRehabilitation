import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { FormControl } from "@mui/material";
import { Endpoint, apiFetch } from "@cbr/common/util/endpoints";

interface IResponseRow {
    id: number;
    zone_name: number;
}
export default function ConfirmDeleteZone(props: any) {
    const { zoneId, users, clients, open, setOpen, handleDeleteZone } = props;
    const { t } = useTranslation();
    const [contentText, setContentText] = useState<string>("");
    const [selectedZone, setSelectedZone] = useState<string>();
    const [zones, setZones] = useState<IResponseRow[]>([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

    useEffect(() => {
        const getZones = async () => {
            const resp = await apiFetch(Endpoint.ZONES);
            const responseRows: IResponseRow[] = await resp.json();
            const allZones = responseRows.map((row) => ({
                id: row.id,
                zone_name: row.zone_name ?? "",
            }));
            setZones(allZones);
        };

        getZones();
    }, []);

    useEffect(() => {
        let userList = "";
        if (users && users.length !== 0) {
            userList += `${t("general.users")}: `;
            for (const user of users) {
                userList += user.username;
                if (user === users[users.length - 1]) {
                    userList += ".";
                } else {
                    userList += ", ";
                }
            }
        }

        let clientList = "";
        if (clients && clients.length !== 0) {
            clientList += `${t("general.clients")}: `;
            for (const client of clients) {
                clientList += client.full_name;
                if (client === clients[clients.length - 1]) {
                    clientList += ".";
                } else {
                    clientList += ", ";
                }
            }
        }

        setContentText(
            `${t("zone.cannotDeleteReason")}\n${userList}\n${clientList}\n\n${t("zone.select")}`
        );
    }, [clients, t, users]);

    const handleSave = async () => {
        return await apiFetch(Endpoint.ZONE_MIGRATION, `${zoneId}/${selectedZone}`).then(
            async (res) => {
                if (!res.ok) {
                    alert(t("zone.migrationError"));
                    return;
                }

                setOpen(false);
                setConfirmDeleteOpen(true);
            }
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t("zone.cannotDelete")}</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{ whiteSpace: "pre-wrap" }}
                    >
                        {contentText}
                    </DialogContentText>
                </DialogContent>
                <FormControl fullWidth style={{ padding: 20, paddingTop: 0 }}>
                    <InputLabel id="demo-simple-select-label">
                        {t("zone.moveUsersAndClients")}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedZone}
                        label="Zone"
                        onChange={(e) => setSelectedZone(e.target.value as string)}
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
                    <Button onClick={() => setOpen(false)}>{t("general.cancel")}</Button>
                    <Button onClick={handleSave} autoFocus>
                        {t("general.save")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t("zone.confirmZoneDelete")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("zone.successfulMigration")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>
                        {t("general.cancel")}
                    </Button>
                    <Button onClick={() => handleDeleteZone(zoneId)} autoFocus>
                        {t("general.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
