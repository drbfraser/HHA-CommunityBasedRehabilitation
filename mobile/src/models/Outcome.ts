import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";
import Visit from "./Visit";
import { SyncableModel } from "./interfaces/SyncableModel";

export default class Outcome extends Model implements SyncableModel {
    static table = modelName.outcomes;
    static associations = {
        visits: { type: mobileGenericField.belongs_to, key: tableKey.visit_id },
    } as const;

    @field("risk_type") risk_type;
    @field("goal_status") goal_met;
    @text("outcome") outcome;

    @relation(modelName.visits, tableKey.visit_id) visit;

    getBriefIdentifier = async (): Promise<string> => {
        const fetchedVisit: Visit = await this.visit.fetch();
        const visitIdentifier: string = await fetchedVisit.getBriefIdentifier();

        return `Outcome of ${visitIdentifier}`;
    };
}
