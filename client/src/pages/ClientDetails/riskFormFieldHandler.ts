import { IRisk } from "util/risks";
import { Endpoint, apiFetch } from "../../util/endpoints";

const updateRisk = async (updatedRisk: string) => {
    const init: RequestInit = {
        method: "POST",
        body: updatedRisk,
    };

    return await apiFetch(Endpoint.RISKS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

export const handleSubmit = async (
    values: IRisk,
    initialValues: IRisk,
    setRisk: (risk: IRisk) => void
) => {
    if (values === initialValues) return;

    const updatedRisk = JSON.stringify({
        client: values.client,
        risk_type: values.risk_type,
        risk_level: values.risk_level,
        goal: values.goal,
        requirement: values.requirement,
    });

    try {
        const risk = await updateRisk(updatedRisk);
        setRisk(risk);
    } catch (e) {
        alert("Encountered an error while trying to update the client's risk");
    }
};
