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

    getBriefIdentifier = (): string => {
        const fetchedVisit: Visit = this.visit.fetch();

        return `Improvement belonging to ${fetchedVisit.getBriefIdentifier()}`;
    }
}
