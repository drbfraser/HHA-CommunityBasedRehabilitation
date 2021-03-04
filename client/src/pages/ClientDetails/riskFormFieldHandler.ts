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
    setClientHealthRisk: (clientHealthRisk: IRisk) => void,
    setClientSocialRisk: (setClientSocialRisk: IRisk) => void,
    setClientEducatRisk: (setClientEducatRisk: IRisk) => void
) => {
    if (values === initialValues) return;

    const updatedRisk = JSON.stringify({
        client: values.client,
        risk_type: values.risk_type,
        risk_level: values.risk_level,
        goal: values.goal,
        requirement: values.requirement,
    });

    console.log(values.risk_type);
    try {
        const risk = await updateRisk(updatedRisk);

        if (values.risk_type === "HEALTH") {
            setClientHealthRisk(risk);
        } else if (values.risk_type === "EDUCAT") {
            setClientEducatRisk(risk);
        } else {
            setClientSocialRisk(risk);
        }
    } catch (e) {
        alert("Encountered an error while trying to update the client's risk");
    }
};
