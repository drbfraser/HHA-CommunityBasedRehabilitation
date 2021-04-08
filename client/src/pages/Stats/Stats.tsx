import { Divider, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { IStats } from "util/stats";
import DisabilityStats from "./DisabilityStats";
import ReferralStats from "./ReferralStats";
import VisitStats from "./VisitStats";

const Stats = () => {
    const [stats, setStats] = useState<IStats>();
    const [errorLoading, setErrorLoading] = useState(false);

    useEffect(() => {
        apiFetch(Endpoint.STATS)
            .then((resp) => resp.json())
            .then((stats) => setStats(stats))
            .catch(() => setErrorLoading(true));
    }, []);

    return errorLoading ? (
        <Alert severity="error">
            Something went wrong loading the statistics. Please try again.
        </Alert>
    ) : (
        <>
            <Typography variant="h2">Visits</Typography>
            <VisitStats stats={stats} />
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Referrals</Typography>
            <ReferralStats stats={stats} />
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Disabilities (All Time)</Typography>
            <DisabilityStats stats={stats} />
        </>
    );
};

export default Stats;
