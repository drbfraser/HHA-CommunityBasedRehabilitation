import { IRisk } from "@cbr/common";
import { dbType } from "../../../util/watermelonDatabase";
import { addRisk } from "../../NewClient/formHandler";

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
    database: dbType
) => {
    if (!wasChangeMade(values, initialValues)) return;

    try {
        let risk;
        const client = await database.get("clients").find(values.client);
        console.log(client);
        await database.write(async () => {
            risk = await addRisk(
                client,
                database,
                values.risk_type,
                values.risk_level,
                values.requirement,
                values.goal
            );
        });
        console.log("updated risk");
        console.log(risk);
        setRisk(risk);
    } catch (e) {
        alert("Encountered an error while trying to update the client's risk");
    }
};
