import { Chip } from "@material-ui/core";
import React, { useState } from "react";
import { IReferral } from "util/referrals";
import TimelineEntry from "../Timeline/TimelineEntry";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { useStyles } from "./Entry.styles";

interface IEntryProps {
    referral: IReferral;
    dateFormatter: (timestamp: number) => string;
}

const ReferralEntry = ({ referral, dateFormatter }: IEntryProps) => {
    const [, setOpen] = useState(false);
    const styles = useStyles();

    const Summary = ({ clickable }: { clickable: boolean }) => {
        const ReasonChip = ({ label }: { label: string }) => (
            <Chip label={label} clickable={clickable} color="primary" variant="outlined" />
        );

        return (
            <>
                {referral.resolved ? (
                    <>
                        <CheckCircleIcon fontSize="small" className={styles.completeIcon} />{" "}
                        Referral Complete
                    </>
                ) : (
                    <>
                        <ScheduleIcon fontSize="small" className={styles.pendingIcon} /> Pending
                        Referral
                    </>
                )}{" "}
                {referral.wheelchair && <ReasonChip label="Wheelchair" />}{" "}
                {referral.physiotherapy && <ReasonChip label="Physiotherapy" />}{" "}
                {referral.prosthetic && <ReasonChip label="Prosthetic" />}{" "}
                {referral.orthotic && <ReasonChip label="Orthotic" />}{" "}
            </>
        );
    };

    return (
        <>
            <TimelineEntry
                date={dateFormatter(referral.date_referred)}
                content={<Summary clickable={true} />}
                onClick={() => setOpen(true)}
            />
        </>
    );
};

export default ReferralEntry;
