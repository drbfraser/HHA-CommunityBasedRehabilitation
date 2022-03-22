import { Button, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React, { useMemo } from "react";
import { IStats } from "@cbr/common/util/stats";
import { CSVLink } from "react-csv";
import { useZones } from "@cbr/common/util/hooks/zones";
import { useDisabilities } from "@cbr/common/util/hooks/disabilities";

interface IProps {
    open: boolean;
    onClose: () => void;
    stats?: IStats;
}

const ExportStats = ({ open, onClose, stats }: IProps) => {
    const zones = useZones();
    const disabilities = useDisabilities();

    const data = useMemo(() => {
        if (!open || !stats || !zones.size || !disabilities.size) {
            return "Data not ready";
        }

        const rows = [];

        rows.push(["***VISITS***"]);
        rows.push(["ZONE", "TOTAL VISITS", "HEALTH", "EDUCATION", "SOCIAL", "NUTRITION"]);
        stats.visits.forEach((v) => {
            rows.push([
                zones.get(v.zone_id),
                v.total,
                v.health_count,
                v.educat_count,
                v.social_count,
                // v.nutrit_count,
            ]);
        });

        rows.push([""]);

        const unres = stats.referrals_unresolved;
        const res = stats.referrals_resolved;

        rows.push(["***REFERRALS***"]);
        rows.push(["REASON", "UNRESOLVED COUNT", "RESOLVED COUNT"]);
        rows.push(["TOTAL", unres.total, res.total]);
        rows.push(["Wheelchair", unres.wheelchair_count, res.wheelchair_count]);
        rows.push(["Physiotherapy", unres.physiotherapy_count, res.physiotherapy_count]);
        rows.push(["Prosthetic", unres.prosthetic_count, res.prosthetic_count]);
        rows.push(["Orthotic", unres.orthotic_count, res.orthotic_count]);
        rows.push(["Other", unres.other_count, res.other_count]);

        rows.push([""]);

        rows.push(["***DISABILITIES***"]);
        rows.push(["Clients with Disabilities", stats.clients_with_disabilities]);
        rows.push(["DISABILITY", "COUNT"]);
        stats.disabilities.forEach((d) => {
            rows.push([disabilities.get(d.disability_id), d.total]);
        });

        return rows;
    }, [open, stats, zones, disabilities]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Export Statistics</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Note that any filters will also apply to exported data.
                </Typography>
                <br />
                <Typography variant="body1">
                    <CSVLink filename="CBRStats.csv" data={data}>
                        Download statistics
                    </CSVLink>{" "}
                    as a CSV file.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportStats;
