import { IRisk } from "@cbr/common/util/risks";
import { Endpoint, apiFetch } from "@cbr/common/util/endpoints";

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

const wasChangeMade = (values: IRisk, initialValues: IRisk) => {
    const keysToCheck = ["risk_level", "requirement", "goal"] as (keyof IRisk)[];

    for (let key of keysToCheck) {
        if (String(values[key]).trim() !== String(initialValues[key]).trim()) {
            return true;
        }
    }

    return false;
};

export const handleSubmit = async (
    values: IRisk,
    initialValues: IRisk,
    setRisk: (risk: IRisk) => void
) => {
    if (!wasChangeMade(values, initialValues)) return;

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
