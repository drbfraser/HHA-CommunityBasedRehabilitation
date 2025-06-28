import { IRisk } from "../../util/risks";
import { apiFetch, Endpoint } from "../../util/endpoints";
import i18n from "i18next";

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
    const keysToCheck = [
        "risk_level",
        "requirement",
        "goal",
        "goal_status",
        "goal_name",
    ] as (keyof IRisk)[];

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
        client_id: values.client_id,
        risk_type: values.risk_type,
        risk_level: values.risk_level,
        goal_name: values.goal_name,
        goal: values.goal_name,
        goal_status: values.goal_status,
        requirement: values.requirement,
    });
    try {
        const risk = await updateRisk(updatedRisk);
        setRisk(risk);
    } catch (e) {
        alert(i18n.t("risks.riskUpdateError"));
    }
};
