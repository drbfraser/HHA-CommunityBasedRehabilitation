import { ClientField, AdminField, ReferralField } from "@cbr/common";

const clientConflictFields = new Set([
    ClientField.birth_date,
    ClientField.caregiver_email,
    ClientField.caregiver_name,
    ClientField.caregiver_phone,
    ClientField.caregiver_present,
    ClientField.disability,
    ClientField.educat_risk_level,
    ClientField.first_name,
    ClientField.gender,
    ClientField.health_risk_level,
    ClientField.last_name,
    ClientField.other_disability,
    ClientField.phone_number,
    ClientField.social_risk_level,
    ClientField.village,
    ClientField.zone,
]);

const referralConflictFields = new Set([ReferralField.outcome]);

const userConflictFields = new Set([
    AdminField.first_name,
    AdminField.last_name,
    AdminField.phone_number,
    AdminField.role,
    AdminField.zone,
]);

export const conflictFields = {
    clients: clientConflictFields,
    referrals: referralConflictFields,
    users: userConflictFields,
};

export const referralLabels = {
    outcome: "Referral Outcome",
};