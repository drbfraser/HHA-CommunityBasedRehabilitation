import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { RiskType } from "@cbr/common/src/util/risks";
import { Model } from "@nozbe/watermelondb";
import {
    field,
    date,
    text,
    readonly,
    relation,
    children,
    json,
    lazy,
} from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";
import { Q } from "@nozbe/watermelondb";
import { mobileGenericField, modelName, tableKey } from "./constant";
import { ReferralField } from "@cbr/common";
import { SyncableModel } from "./interfaces/SyncableModel";

const sanitizeDisability = (rawDisability) => {
    return Array.isArray(rawDisability) ? rawDisability.map(Number) : [];
};

export default class Client extends Model implements SyncableModel {
    static table = modelName.clients;
    static associations = {
        users: { type: mobileGenericField.belongs_to, key: tableKey.user_id },
        risks: { type: mobileGenericField.has_many, foreignKey: tableKey.client_id },
        referrals: { type: mobileGenericField.has_many, foreignKey: tableKey.client_id },
        surveys: { type: mobileGenericField.has_many, foreignKey: tableKey.client_id },
        visits: { type: mobileGenericField.has_many, foreignKey: tableKey.client_id },
    } as const;

    @text(ClientField.first_name) first_name;
    @text(ClientField.last_name) last_name;
    @text(ClientField.full_name) full_name;
    @date(ClientField.birth_date) birth_date;
    @field(ClientField.gender) gender;
    @text(ClientField.phone_number) phone_number;
    @json(ClientField.disability, sanitizeDisability) disability;
    @text(ClientField.other_disability) other_disability;
    @field(ClientField.longitude) longitude;
    @field(ClientField.latitude) latitude;
    @field(ClientField.zone) zone;
    @field(ClientField.village) village;
    @field(ClientField.picture) picture;
    @field(ClientField.caregiver_present) caregiver_present;
    @text(ClientField.caregiver_name) caregiver_name;

    @text(ClientField.caregiver_phone) caregiver_phone;
    @text(ClientField.caregiver_email) caregiver_email;
    @text(ClientField.health_risk_level) health_risk_level;
    @date(ClientField.health_timestamp) health_timestamp;
    @text(ClientField.social_risk_level) social_risk_level;
    @date(ClientField.social_timestamp) social_timestamp;
    @text(ClientField.educat_risk_level) educat_risk_level;
    @date(ClientField.educat_timestamp) educat_timestamp;
    @date(ClientField.last_visit_date) last_visit_date;

    @readonly @date(mobileGenericField.created_at) createdAt;
    @readonly @date(mobileGenericField.updated_at) updatedAt;

    @relation(modelName.users, tableKey.user_id) user;

    @children(modelName.risks) risks;
    @children(modelName.referrals) referrals;
    @children(modelName.surveys) surveys;
    @children(modelName.visits) visits;

    @lazy outstandingReferrals = this.collections
        .get(modelName.referrals)
        .query(
            Q.where(tableKey.client_id, this.id),
            Q.and(Q.where(ReferralField.resolved, Q.eq(false)))
        );

    @writer async updateRisk(type, level, time) {
        await this.update((client) => {
            switch (type) {
                case RiskType.HEALTH:
                    client.health_risk_level = level;
                    client.health_timestamp = time;
                    break;

                case RiskType.SOCIAL:
                    client.social_risk_level = level;
                    client.social_timestamp = time;
                    break;

                case RiskType.EDUCATION:
                    client.educat_risk_level = level;
                    client.educat_timestamp = time;
                    break;
            }
        });
    }

    @writer async newRiskTime() {
        await this.update((client) => {
            client.educat_timestamp = this.createdAt;
            client.health_timestamp = this.createdAt;
            client.social_timestamp = this.createdAt;
        });
    }

    @writer async updateVisitTime(visitTime) {
        await this.update((client) => {
            client.last_visit_date = visitTime;
        });
    }

    getBriefIdentifier = (): string => {
        return `Client with name ${this.full_name}`;
    };
}
