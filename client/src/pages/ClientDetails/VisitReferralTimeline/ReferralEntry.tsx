import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React, { useState } from "react";
import {
    IReferral,
    orthoticInjuryLocations,
    prostheticInjuryLocations,
    wheelchairExperiences,
} from "util/referrals";
import TimelineEntry from "../Timeline/TimelineEntry";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { useStyles } from "./Entry.styles";
import { timestampToDateTime } from "util/dates";
import NearMeIcon from "@material-ui/icons/NearMe";

interface IEntryProps {
    referral: IReferral;
    dateFormatter: (timestamp: number) => string;
}

const ReferralEntry = ({ referral, dateFormatter }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const styles = useStyles();

    const Summary = ({ clickable }: { clickable: boolean }) => {
        const ReasonChip = ({ label }: { label: string }) => (
            <Chip label={label} clickable={clickable} color="primary" variant="outlined" />
        );

        return (
            <>
                {referral.resolved ? (
                    <CheckCircleIcon fontSize="small" className={styles.completeIcon} />
                ) : (
                    <ScheduleIcon fontSize="small" className={styles.pendingIcon} />
                )}{" "}
                Referral {referral.resolved ? "Complete" : "Pending"}{" "}
                {referral.wheelchair && <ReasonChip label="Wheelchair" />}{" "}
                {referral.physiotherapy && <ReasonChip label="Physiotherapy" />}{" "}
                {referral.prosthetic && <ReasonChip label="Prosthetic" />}{" "}
                {referral.orthotic && <ReasonChip label="Orthotic" />}{" "}
            </>
        );
    };

    const ReferralDialog = () => {
        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    <Summary clickable={false} />
                </DialogTitle>
                <DialogContent>
                    <b>Referral Date:</b> {timestampToDateTime(referral.date_referred)}
                    <br />
                    <br />
                    {referral.resolved && (
                        <>
                            <b>Resolution Date:</b> {timestampToDateTime(referral.date_resolved)}
                            <br />
                            <b>Outcome:</b> {referral.outcome}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.wheelchair && (
                        <>
                            <b>Wheelchair Experience: </b>
                            {wheelchairExperiences[referral.wheelchair_experience]}
                            <br />
                            <b>Hip Width:</b> {referral.hip_width} inches
                            <br />
                            <b>Wheelchair Owned?</b> {referral.wheelchair_owned ? "Yes" : "No"}
                            <br />
                            <b>Wheelchair Repairable?</b>{" "}
                            {referral.wheelchair_repairable ? "Yes" : "No"}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.physiotherapy && (
                        <>
                            <b>Physiotherapy Condition:</b> {referral.condition}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.prosthetic && (
                        <>
                            <b>Prosthetic Injury Location: </b>
                            {prostheticInjuryLocations[referral.prosthetic_injury_location]}
                            <br />
                            <br />
                        </>
                    )}
                    {referral.orthotic && (
                        <>
                            <b>Orthotic Injury Location: </b>
                            {orthoticInjuryLocations[referral.orthotic_injury_location]}
                            <br />
                            <br />
                        </>
                    )}
                    {Boolean(referral.services_other.trim().length) && (
                        <>
                            <b>Other Services Required:</b> {referral.services_other}
                            <br />
                            <br />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <>
            <TimelineEntry
                date={dateFormatter(referral.date_referred)}
                content={<Summary clickable={true} />}
                DotIcon={NearMeIcon}
                onClick={() => setOpen(true)}
            />
            <ReferralDialog />
        </>
    );
};

export default ReferralEntry;
