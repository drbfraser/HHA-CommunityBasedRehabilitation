import { ImprovementFormField } from "@cbr/common";
import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";
import Visit from "./Visit";
import { SyncableModel } from "./interfaces/SyncableModel";

export default class Improvement extends Model implements SyncableModel {
    static table = modelName.improvements;
    static associations = {
        visits: { type: mobileGenericField.belongs_to, key: tableKey.visit_id },
    } as const;

    @field(ImprovementFormField.riskType) risk_type;
    @field(ImprovementFormField.provided) provided;
    @text(ImprovementFormField.description) desc;

    @relation(modelName.visits, tableKey.visit_id) visit;

    getBriefIdentifier = async (): Promise<string> => {
        const fetchedVisit: Visit = await this.visit.fetch();
        const visitIdentifier: string = await fetchedVisit.getBriefIdentifier();

        return `Improvement from ${visitIdentifier}`;
    };
}
