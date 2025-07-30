import { GoalStatus, IRisk, OutcomeGoalMet, RiskLevel } from "@cbr/common";
import { modelName } from "../../../models/constant";
import { dbType } from "../../../util/watermelonDatabase";
import { addRisk } from "../../NewClient/formHandler";
import { AutoSyncDB } from "../../../util/syncHandler";
import i18n from "i18next";
import Client from "@/src/models/Client";

const wasChangeMade = (values: IRisk, initialValues: IRisk) => {
    const keysToCheck = [
        "risk_level",
        "requirement",
        "goal_name",
        "goal_status",
        "cancellation_reason",
    ] as (keyof IRisk)[];

    for (let key of keysToCheck) {
        if (String(values[key]).trim() !== String(initialValues[key]).trim()) {
            return true;
        }
    }
    return false;
};

export const handleRiskSubmit = async (
    values: IRisk,
    initialValues: IRisk,
    setRisk: (risk: IRisk) => void,
    database: dbType,
    autoSync: boolean,
    cellularSync: boolean
) => {
    if (!wasChangeMade(values, initialValues)) return;

    try {
        let risk;
        const client = await database.get<Client>(modelName.clients).find(values.client_id);
        const currentTime = new Date().getTime();

        let finalRiskLevelForClient = values.risk_level;
        const goalCompleted =
            values.goal_status === OutcomeGoalMet.CONCLUDED ||
            values.goal_status === OutcomeGoalMet.CANCELLED;

        if (goalCompleted) finalRiskLevelForClient = RiskLevel.NOT_ACTIVE;

        await database.write(async () => {
            risk = await addRisk(
                client,
                database,
                values.risk_type,
                values.risk_level,
                values.requirement,
                values.goal_name,
                values.goal_status,
                values.cancellation_reason,
                currentTime
            );
        });
        await client.updateRisk(values.risk_type, finalRiskLevelForClient, currentTime);
        setRisk(risk);
        AutoSyncDB(database, autoSync, cellularSync);
    } catch (e) {
        console.error("Risk submission failed:", e);
        alert(i18n.t("riskAttr.updateFailureAlert"));
    }
};
