import { IRisk } from "@cbr/common";
import { modelName } from "../../../models/constant";
import { dbType } from "../../../util/watermelonDatabase";
import { addRisk } from "../../NewClient/formHandler";
import { AutoSyncDB } from "../../../util/syncHandler";
import i18n from "i18next";
import Client from "@/src/models/Client";

const wasChangeMade = (values: IRisk, initialValues: IRisk) => {
    const keysToCheck = ["risk_level", "requirement", "goal"] as (keyof IRisk)[];

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
        await database.write(async () => {
            risk = await addRisk(
                client,
                database,
                values.risk_type,
                values.risk_level,
                values.requirement,
                values.goal,
                currentTime
            );
        });

        await client.updateRisk(values.risk_type, values.risk_level, currentTime);
        setRisk(risk);

        AutoSyncDB(database, autoSync, cellularSync);
    } catch (e) {
        alert(i18n.t("riskAttr.updateFailureAlert"));
    }
};
