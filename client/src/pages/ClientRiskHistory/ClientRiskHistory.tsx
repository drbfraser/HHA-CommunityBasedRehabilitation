import { LinearProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { ArrowBack } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IClient } from 'util/clients';
import { apiFetch, Endpoint } from 'util/endpoints';
import RiskHistoryEntry from './RiskHistoryEntry';

interface IRouteParams {
    clientId: string;
}

enum ReqStatus {
    LOADING,
    LOADED,
    ERROR
}

const ClientRiskHistory = () => {
    const history = useHistory();
    const { clientId } = useRouteMatch<IRouteParams>().params;
    const [status, setStatus] = useState(ReqStatus.LOADING);
    const [client, setClient] = useState<IClient>();

    useEffect(() => {
        const getClient = async () => {
            try {
                const resp = await (await apiFetch(Endpoint.CLIENT, `${clientId}`)).json();
                setClient(resp);
                setStatus(ReqStatus.LOADED);
            }
            catch(e) {
                setStatus(ReqStatus.ERROR);
            }
        }

        getClient();
    })

    return <>
        <Button onClick={history.goBack}>
            <ArrowBack /> Go back
        </Button>
        <br /><br />
        {
            status === ReqStatus.LOADING &&
            <LinearProgress />
        }
        {
            status === ReqStatus.ERROR &&
            <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
        }
        {
            status === ReqStatus.LOADED &&
            client?.risks.map(risk => <RiskHistoryEntry risk={risk} />)
        }
    </>
}

export default ClientRiskHistory;