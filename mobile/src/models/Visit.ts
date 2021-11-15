import { VisitField } from "@cbr/common/src/forms/newVisit/visitFormFields";
import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, relation, children } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default class Visit extends Model {
    static table = modelName.visits;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
        users: { type: mobileGenericField.belongs_to, key: tableKey.user_id },
        improvements: { type: mobileGenericField.has_many, foreignKey: tableKey.visit_id },
        outcomes: { type: mobileGenericField.has_many, foreignKey: tableKey.visit_id },
    } as const;

    @field(VisitField.health_visit) health_visit;
    @field(VisitField.educat_visit) educat_visit;
    @field(VisitField.social_visit) social_visit;
    @field(VisitField.longitude) longitude;
    @field(VisitField.latitude) latitude;
    @field(VisitField.zone) zone;
    @field(VisitField.village) village;

    @readonly @date(mobileGenericField.created_at) createdAt;

    @relation(modelName.clients, tableKey.client_id) client;
    @relation(modelName.users, tableKey.user_id) user;
    @children(modelName.outcomes) outcomes;
    @children(modelName.improvements) improvements;

    @writer async addVisitSpec(riskType: boolean, improvement: any, outcome: any) {
        if (riskType) {
            improvement.forEach(async (element) => {
                if (element.enabled) {
                    await this.collections.get(modelName.improvements).create((improv: any) => {
                        improv.visit.set(this);
                        improv.risk_type = element.risk_type;
                        improv.provided = element.provided;
                        improv.desc = element.desc;
                    });
                }
            });
            await this.collections.get(modelName.outcomes).create((o: any) => {
                o.visit.set(this);
                o.risk_type = outcome.risk_type;
                o.goal_met = outcome.goal_met;
                o.outcome = outcome.outcome;
            });
        }
    }
}
