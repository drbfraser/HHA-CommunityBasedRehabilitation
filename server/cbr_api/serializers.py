from curses.ascii import isdigit
import imghdr
import os
import time
import uuid
from typing import Optional
from django.contrib.auth.password_validation import validate_password
from django.core.files import File
from rest_framework import serializers

from cbr_api import models
from cbr_api.util import (
    current_milli_time,
    create_client_data,
    create_user_data,
    create_referral_data,
    create_survey_data,
    create_generic_data,
    create_update_delete_alert_data,
)
import logging

logger = logging.getLogger(__name__)


# create and list


class UserCBRCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = models.UserCBR
        fields = (
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "role",
            "zone",
            "phone_number",
            "is_active",
        )
        read_only_fields = ["id"]

    def create(self, validated_data):
        validated_data["id"] = uuid.uuid4()
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()

        return user


class UserCBRSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserCBR
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "role",
            "zone",
            "phone_number",
            "is_active",
            "created_at",
            "updated_at",
        )

    def update(self, user, validated_data):
        logger.info("Update user %s", user.username)
        validated_data["updated_at"] = current_milli_time()
        super().update(user, validated_data)
        return user


class editUserCBRSerializer(serializers.ModelSerializer):
    # disable uniquie validator for id to allow POST push sync request to update records
    id = serializers.CharField(validators=[])
    password = serializers.CharField(allow_blank=True)

    class Meta:
        model = models.UserCBR
        fields = (
            "id",
            "first_name",
            "last_name",
            "password",
            "role",
            "zone",
            "phone_number",
            "is_active",
            "created_at",
            "updated_at",
        )


class UserPasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = models.UserCBR
        fields = ("new_password",)

    def update(self, user, validated_data):
        logger.info("User %s changed password", user.username)
        user.set_password(validated_data["new_password"])
        user.save()
        return user


class UserCurrentPasswordSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = models.UserCBR
        fields = ("current_password", "new_password")

    def update(self, user, validated_data):
        if not user.check_password(validated_data["current_password"]):
            logger.warning("Failed password change attempt by user %s", user.username)
            raise serializers.ValidationError(
                {"detail": "Current password is incorrect"}
            )

        user.set_password(validated_data["new_password"])
        user.save()
        logger.info("User %s successfully changed password.", user.username)
        return user


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Zone
        fields = [
            "id",
            "zone_name",
        ]


class DisabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Disability
        fields = [
            "id",
            "disability_type",
        ]


class ClientCreationRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClientRisk
        fields = [
            "id",
            "client_id",
            "timestamp",
            "risk_type",
            "risk_level",
            "requirement",
            "goal",
            "goal_name",
            "goal_status",
            "cancellation_reason",
            "start_date",
            "end_date",
            "change_type",
        ]

        read_only_fields = ["id", "client_id", "timestamp", "risk_type", "change_type"]


class NormalRiskSerializer(serializers.ModelSerializer):
    NO_ACTIVE_GOAL_STATUSES = [
        models.GoalOutcomes.CONCLUDED,
        models.GoalOutcomes.NOT_SET,
        models.GoalOutcomes.CANCELLED,
    ]

    class Meta:
        model = models.ClientRisk
        fields = [
            "id",
            "client_id",
            "timestamp",
            "risk_type",
            "risk_level",
            "requirement",
            "goal",
            "goal_name",
            "goal_status",
            "cancellation_reason",
            "start_date",
            "end_date",
            "change_type",
        ]

        read_only_fields = ["id", "timestamp", "change_type"]

    def get_previous_risk(self, filter_params):
        # find the previous risk record for the same client and risk type
        return (
            models.ClientRisk.objects.filter(
                client_id=filter_params["client"],
                risk_type=filter_params["risk_type"],
                timestamp__lt=filter_params["current_time"],
            )
            .order_by("-timestamp")
            .first()
        )

    def determine_effective_goal_status(
        self, provided_goal_status, change_type, client, risk_type
    ):
        if provided_goal_status is not None:
            return provided_goal_status

        # if goal status is not provided and initial risk object, set to "NS"
        if change_type == models.RiskChangeType.INITIAL:
            return models.GoalOutcomes.NOT_SET

        # for non-initial updates without goal_status, preserve the previous goal_status
        filter_params = dict(
            client=client,
            risk_type=risk_type,
            current_time=current_milli_time(),
        )
        previous_risk = self.get_previous_risk(filter_params)
        if previous_risk:
            return previous_risk.goal_status

        # fallback (shouldn't happen, but just in case)
        return models.GoalOutcomes.NOT_SET

    def get_change_type(self, filter_params, goal_status, risk_level):
        previous_risk = self.get_previous_risk(filter_params)
        # decide change_type based on previous risk
        if not previous_risk:
            return models.RiskChangeType.INITIAL

        changed_risk_level = previous_risk.risk_level != risk_level
        changed_goal_status = goal_status and (previous_risk.goal_status != goal_status)

        if changed_risk_level and changed_goal_status:
            return models.RiskChangeType.BOTH
        elif changed_risk_level:
            return models.RiskChangeType.RISK_LEVEL
        elif changed_goal_status:
            return models.RiskChangeType.GOAL_STATUS
        else:
            return models.RiskChangeType.OTHER

    def determine_client_risk_level(self, goal_status, original_risk_level):
        # if risk update is for starting a new goal or a risk level change, keep the original risk level
        if goal_status in self.NO_ACTIVE_GOAL_STATUSES:
            return models.RiskLevel.NOT_ACTIVE
        return original_risk_level

    def update_client_risk_level_and_timestamp(
        self, client, risk_type, risk_level, current_time
    ):
        # update the client risk level and timestamp based on risk type
        if risk_type == models.RiskType.HEALTH:
            client.health_risk_level = risk_level
            client.health_timestamp = current_time
        elif risk_type == models.RiskType.SOCIAL:
            client.social_risk_level = risk_level
            client.social_timestamp = current_time
        elif risk_type == models.RiskType.EDUCAT:
            client.educat_risk_level = risk_level
            client.educat_timestamp = current_time
        elif risk_type == models.RiskType.NUTRIT:
            client.nutrit_risk_level = risk_level
            client.nutrit_timestamp = current_time
        elif risk_type == models.RiskType.MENTAL:
            client.mental_risk_level = risk_level
            client.mental_timestamp = current_time

    def create(self, validated_data):
        current_time = current_milli_time()
        risk_type = validated_data["risk_type"]
        risk_level = validated_data["risk_level"]
        client = validated_data["client_id"]
        goal_status = validated_data.get("goal_status")

        filter_params = dict(
            client=client, risk_type=risk_type, current_time=current_time
        )
        change_type = self.get_change_type(filter_params, goal_status, risk_level)

        # effective goal_status for this risk record to use for updating client risk level
        effective_goal_status = self.determine_effective_goal_status(
            goal_status, change_type, client, risk_type
        )

        # create the risk object with the change_type
        validated_data["timestamp"] = current_time
        validated_data["server_created_at"] = current_time
        validated_data["id"] = uuid.uuid4()
        validated_data["change_type"] = change_type

        risk = models.ClientRisk.objects.create(**validated_data)
        risk.save()

        # determine what the client's risk level should be based on goal status
        client_risk_level = self.determine_client_risk_level(
            effective_goal_status, risk_level
        )

        # update the client risk level and timestamp
        self.update_client_risk_level_and_timestamp(
            client, risk_type, client_risk_level, current_time
        )

        # update client's general updated_at timestamp
        client.updated_at = current_time
        client.save()

        return risk


class ClientRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClientRisk
        fields = [
            "id",
            "client_id",
            "timestamp",
            "risk_type",
            "risk_level",
            "requirement",
            "goal",
            "goal_name",
            "goal_status",
            "cancellation_reason",
            "start_date",
            "end_date",
            "change_type",
        ]
        read_only_fields = ["change_type"]


class ImprovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Improvement
        fields = ["id", "visit_id", "risk_type", "provided", "desc", "created_at"]

        read_only_fields = ["visit_id", "created_at"]


class ImprovementSyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Improvement
        fields = ["id", "visit_id", "risk_type", "provided", "desc", "created_at"]


class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Outcome
        fields = [
            "id",
            "visit_id",
            "risk_type",
            "goal_met",
            "outcome",
            "created_at",
        ]

        read_only_fields = ["visit_id", "created_at"]


class OutcomeSyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Outcome
        fields = [
            "id",
            "visit_id",
            "risk_type",
            "goal_met",
            "outcome",
            "created_at",
        ]


class UpdateReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Referral
        fields = ["date_resolved", "resolved", "outcome", "updated_at"]

        read_only_fields = ["date_resolved"]

    def update(self, referral, validated_data):
        super().update(referral, validated_data)
        referral.resolved = validated_data["resolved"]
        if validated_data["resolved"] == True:
            current_time = current_milli_time()
            referral.date_resolved = current_time
        else:
            referral.date_resolved = 0
        referral.outcome = validated_data["outcome"]
        referral.updated_at = current_milli_time()
        referral.save()
        return referral


class DetailedReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Referral
        fields = [
            "id",
            "user_id",
            "client_id",
            "date_referred",
            "date_resolved",
            "resolved",
            "outcome",
            "wheelchair",
            "wheelchair_experience",
            "hip_width",
            "wheelchair_owned",
            "wheelchair_repairable",
            "physiotherapy",
            "condition",
            "prosthetic",
            "prosthetic_injury_location",
            "orthotic",
            "orthotic_injury_location",
            "hha_nutrition_and_agriculture_project",
            "emergency_food_aid",
            "agriculture_livelihood_program_enrollment",
            "mental_health",
            "mental_health_condition",
            "services_other",
            "picture",
            "updated_at",
            "server_created_at",
        ]

        read_only_fields = [
            "id",
            "user_id",
            "outcome",
            "date_referred",
            "date_resolved",
            "resolved",
            "updated_at",
            "server_created_at",
        ]

    def create(self, validated_data):
        current_time = current_milli_time()
        validated_data["id"] = uuid.uuid4()
        validated_data["user_id"] = self.context["request"].user
        validated_data["date_referred"] = current_time
        validated_data["server_created_at"] = current_time
        referrals = models.Referral.objects.create(**validated_data)
        referrals.save()
        return referrals


class ReferralSyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Referral
        fields = [
            "id",
            "client_id",
            "date_referred",
            "date_resolved",
            "resolved",
            "outcome",
            "wheelchair",
            "wheelchair_experience",
            "hip_width",
            "wheelchair_owned",
            "wheelchair_repairable",
            "physiotherapy",
            "condition",
            "prosthetic",
            "prosthetic_injury_location",
            "orthotic",
            "orthotic_injury_location",
            "hha_nutrition_and_agriculture_project",
            "emergency_food_aid",
            "agriculture_livelihood_program_enrollment",
            "mental_health",
            "mental_health_condition",
            "services_other",
            "picture",
            "updated_at",
            "server_created_at",
        ]

        extra_kwargs = {
            "outcome": {
                "allow_blank": True,
            }
        }


class ReferralUpdateSerializer(serializers.ModelSerializer):
    # disable unique validator for id to allow POST push sync request to update records
    id = serializers.CharField(validators=[])

    class Meta:
        model = models.Referral
        fields = ["id", "date_resolved", "resolved", "outcome", "updated_at"]


class OutstandingReferralSerializer(serializers.Serializer):
    id = serializers.CharField()
    referral_id = serializers.CharField()
    full_name = serializers.CharField()
    services_other = serializers.CharField()
    physiotherapy = serializers.BooleanField()
    hha_nutrition_and_agriculture_project = serializers.BooleanField()
    mental_health = serializers.BooleanField()
    wheelchair = serializers.BooleanField()
    prosthetic = serializers.BooleanField()
    orthotic = serializers.BooleanField()
    date_referred = serializers.IntegerField()


class DetailedVisitSerializer(serializers.ModelSerializer):
    print("---- CREATE is called 1 ----")
    improvements = ImprovementSerializer(many=True)
    outcomes = OutcomeSerializer(many=True)

    class Meta:
        model = models.Visit
        fields = [
            "id",
            "user_id",
            "client_id",
            "created_at",
            "health_visit",
            "educat_visit",
            "social_visit",
            "nutrit_visit",
            "mental_visit",
            "longitude",
            "latitude",
            "zone",
            "village",
            "improvements",
            "outcomes",
        ]

        read_only_fields = ["id", "user_id", "created_at"]

    def create(self, validated_data):
        print("---- CREATE is called 2 ----")
        current_time = current_milli_time()

        improvement_dataset = validated_data.pop("improvements")
        outcome_dataset = validated_data.pop("outcomes")

        validated_data["id"] = uuid.uuid4()
        validated_data["user_id"] = self.context["request"].user
        validated_data["created_at"] = current_time
        validated_data["server_created_at"] = current_time
        visit = models.Visit.objects.create(**validated_data)
        visit.save()

        client = validated_data["client_id"]
        client.last_visit_date = current_time
        client.save()

        for improvement_data in improvement_dataset:
            improvement_data["id"] = uuid.uuid4()
            improvement_data["visit_id"] = visit
            improvement_data["created_at"] = current_time
            improvement_data["server_created_at"] = current_time
            improvement = models.Improvement.objects.create(**improvement_data)
            improvement.save()

        for outcome_data in outcome_dataset:
            outcome_data["id"] = uuid.uuid4()
            outcome_data["visit_id"] = visit
            outcome_data["created_at"] = current_time
            outcome_data["server_created_at"] = current_time
            outcome = models.Outcome.objects.create(**outcome_data)
            outcome.save()

        return visit


class SummaryVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Visit
        fields = [
            "id",
            "user_id",
            "client_id",
            "created_at",
            "health_visit",
            "educat_visit",
            "social_visit",
            "nutrit_visit",
            "mental_visit",
            "longitude",
            "latitude",
            "zone",
            "village",
        ]


class ConfigStatsSerializer(serializers.Serializer):
    @classmethod
    def create_serializer(cls, class_name, stat_types=None):
        demographics = [
            "female_adult_total",
            "male_adult_total",
            "female_child_total",
            "male_child_total",
        ]

        fields = {
            "zone_id": serializers.IntegerField(),
            "total": serializers.IntegerField(),
            "hcr_type": serializers.CharField(),
        }

        if stat_types:
            for stat_type in stat_types:
                fields.update(
                    {
                        **{
                            f"{stat_type}_{demo}": serializers.IntegerField()
                            for demo in demographics
                        },
                    }
                )

        else:
            fields.update(
                {
                    **{f"{demo}": serializers.IntegerField() for demo in demographics},
                }
            )

        return type(f"{class_name}", (serializers.Serializer,), fields)


AdminStatsReferralSerializer = ConfigStatsSerializer.create_serializer(
    "AdminStatsReferralSerializer",
    [
        "wheelchair",
        "physiotherapy",
        "prosthetic",
        "orthotic",
        "nutrition_agriculture",
        "mental_health",
        "other",
    ],
)

AdminStatsVisitsSerializer = ConfigStatsSerializer.create_serializer(
    "AdminStatsVisitsSerializer", ["health", "educat", "social", "nutrit", "mental"]
)

AdminStatsNewClientsSerializer = ConfigStatsSerializer.create_serializer(
    "AdminStatsNewClientsSerializer"
)

AdminStatsFollowUpVisitsSerializer = ConfigStatsSerializer.create_serializer(
    "AdminStatsFollowUpVisitsSerializer"
)


class ClientBreakdown(serializers.Serializer):
    zone_id = serializers.IntegerField()
    total = serializers.IntegerField()
    female_adult_total = serializers.IntegerField()
    male_adult_total = serializers.IntegerField()
    female_child_total = serializers.IntegerField()
    male_child_total = serializers.IntegerField()
    hcr_type = serializers.CharField()


class AdminStatsDisabilitySerializer(ClientBreakdown):
    disability_id = serializers.IntegerField()
    total = serializers.IntegerField()


class AdminStatsSerializer(serializers.Serializer):
    disabilities = AdminStatsDisabilitySerializer(many=True, read_only=True)
    clients_with_disabilities = serializers.IntegerField()
    visits = AdminStatsVisitsSerializer(many=True, read_only=True)
    referrals_resolved = AdminStatsReferralSerializer(many=False, read_only=True)
    referrals_unresolved = AdminStatsReferralSerializer(many=False, read_only=True)
    new_clients = AdminStatsNewClientsSerializer(many=True, read_only=True)
    follow_up_visits = AdminStatsFollowUpVisitsSerializer(many=True, read_only=True)


class ClientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = [
            "id",
            "full_name",
            "zone",
            "health_risk_level",
            "social_risk_level",
            "educat_risk_level",
            "nutrit_risk_level",
            "mental_risk_level",
            "last_visit_date",
            "user_id",
            "is_active",
            "hcr_type",
        ]


class ClientSyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "birth_date",
            "gender",
            "phone_number",
            "disability",
            "other_disability",
            "longitude",
            "latitude",
            "user_id",
            "created_at",
            "updated_at",
            "zone",
            "village",
            "hcr_type",
            "picture",
            "caregiver_present",
            "caregiver_name",
            "caregiver_phone",
            "caregiver_email",
            "health_risk_level",
            "health_timestamp",
            "social_risk_level",
            "social_timestamp",
            "educat_risk_level",
            "educat_timestamp",
            "nutrit_risk_level",
            "nutrit_timestamp",
            "mental_risk_level",
            "mental_timestamp",
            "last_visit_date",
            "is_active",
        ]


class editClientSyncSerializer(serializers.ModelSerializer):
    id = serializers.CharField(validators=[])

    class Meta:
        model = models.Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "birth_date",
            "gender",
            "phone_number",
            "disability",
            "other_disability",
            "longitude",
            "latitude",
            "user_id",
            "created_at",
            "updated_at",
            "zone",
            "village",
            "hcr_type",
            "picture",
            "caregiver_present",
            "caregiver_name",
            "caregiver_phone",
            "caregiver_email",
            "health_risk_level",
            "health_timestamp",
            "social_risk_level",
            "social_timestamp",
            "educat_risk_level",
            "educat_timestamp",
            "nutrit_risk_level",
            "nutrit_timestamp",
            "mental_risk_level",
            "mental_timestamp",
            "last_visit_date",
            "is_active",
        ]


class BaselineSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BaselineSurvey
        fields = "__all__"

        read_only_fields = [
            "id",
            "user_id",
            "survey_date",
            "server_created_at",
        ]

    def create(self, validated_data):
        current_time = current_milli_time()
        validated_data["id"] = uuid.uuid4()
        validated_data["survey_date"] = current_time
        validated_data["server_created_at"] = current_time
        validated_data["user_id"] = self.context["request"].user
        baseline_survey = models.BaselineSurvey.objects.create(**validated_data)
        baseline_survey.save()
        return baseline_survey


class BaselineSurveySyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BaselineSurvey
        fields = "__all__"

        read_only_fields = ["user_id"]


class ClientCreateSerializer(serializers.ModelSerializer):
    health_risk = ClientCreationRiskSerializer(many=False, write_only=True)
    social_risk = ClientCreationRiskSerializer(many=False, write_only=True)
    educat_risk = ClientCreationRiskSerializer(many=False, write_only=True)
    nutrit_risk = ClientCreationRiskSerializer(many=False, write_only=True)
    mental_risk = ClientCreationRiskSerializer(many=False, write_only=True)

    class Meta:
        model = models.Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "birth_date",
            "gender",
            "phone_number",
            "disability",
            "other_disability",
            "user_id",
            "created_at",
            "updated_at",
            "server_created_at",
            "longitude",
            "latitude",
            "zone",
            "village",
            "hcr_type",
            "picture",
            "caregiver_name",
            "caregiver_present",
            "caregiver_phone",
            "caregiver_email",
            "health_risk",
            "social_risk",
            "educat_risk",
            "nutrit_risk",
            "mental_risk",
        ]

        read_only_fields = [
            "id",
            "user_id",
            "created_at",
            "updated_at",
            "server_created_at",
            "full_name",
        ]

    def create(self, validated_data):
        current_time = current_milli_time()
        # must be removed before passing validated_data into Client.objects.create
        health_data = validated_data.pop("health_risk")
        social_data = validated_data.pop("social_risk")
        educat_data = validated_data.pop("educat_risk")
        nutrit_data = validated_data.pop("nutrit_risk")
        mental_data = validated_data.pop("mental_risk")

        validated_data["health_risk_level"] = health_data["risk_level"]
        validated_data["social_risk_level"] = social_data["risk_level"]
        validated_data["educat_risk_level"] = educat_data["risk_level"]
        validated_data["nutrit_risk_level"] = nutrit_data["risk_level"]
        validated_data["mental_risk_level"] = mental_data["risk_level"]

        validated_data["health_timestamp"] = current_time
        validated_data["social_timestamp"] = current_time
        validated_data["educat_timestamp"] = current_time
        validated_data["nutrit_timestamp"] = current_time
        validated_data["mental_timestamp"] = current_time

        validated_data["full_name"] = (
            validated_data["first_name"] + " " + validated_data["last_name"]
        )
        validated_data["id"] = uuid.uuid4()
        validated_data["user_id"] = self.context["request"].user
        validated_data["created_at"] = current_time
        validated_data["server_created_at"] = current_time
        client = super().create(validated_data)

        def create_risk(data, type, time):
            data["id"] = uuid.uuid4()
            data["client_id"] = client
            data["timestamp"] = time
            data["server_created_at"] = time
            data["risk_type"] = type
            risk = models.ClientRisk.objects.create(**data)
            risk.save()

        create_risk(health_data, models.RiskType.HEALTH, current_time)
        create_risk(social_data, models.RiskType.SOCIAL, current_time)
        create_risk(educat_data, models.RiskType.EDUCAT, current_time)
        create_risk(nutrit_data, models.RiskType.NUTRIT, current_time)
        create_risk(mental_data, models.RiskType.MENTAL, current_time)

        return client


class ClientDetailSerializer(serializers.ModelSerializer):
    risks = ClientCreationRiskSerializer(many=True, read_only=True)
    visits = SummaryVisitSerializer(many=True, read_only=True)
    referrals = DetailedReferralSerializer(many=True, read_only=True)
    baseline_surveys = BaselineSurveySerializer(many=True, read_only=True)

    class Meta:
        model = models.Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "birth_date",
            "gender",
            "phone_number",
            "disability",
            "other_disability",
            "user_id",
            "created_at",
            "updated_at",
            "longitude",
            "latitude",
            "zone",
            "village",
            "hcr_type",
            "picture",
            "caregiver_name",
            "caregiver_present",
            "caregiver_phone",
            "caregiver_email",
            "risks",
            "visits",
            "referrals",
            "baseline_surveys",
            "is_active",
        ]

        read_only_fields = ["user_id", "created_at", "updated_at"]

    def update(self, instance: models.Client, validated_data):
        validated_data["updated_at"] = current_milli_time()
        new_client_picture: Optional[File] = validated_data.get("picture")
        if new_client_picture:
            file_root, file_ext = os.path.splitext(new_client_picture.name)
            actual_image_type: Optional[str] = imghdr.what(new_client_picture.file)
            if actual_image_type and actual_image_type != file_ext.removeprefix("."):
                new_client_picture.name = f"{file_root}.{actual_image_type}"

        super().update(instance, validated_data)
        instance.full_name = instance.first_name + " " + instance.last_name
        instance.save()
        return instance


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Alert
        fields = (
            "id",
            "subject",
            "priority",
            "alert_message",
            "unread_by_users",
            "created_by_user",
            "server_created_at",
            "updated_at",
            "created_date",
        )

        read_only_fields = ["id"]

    def create(self, validated_data):
        current_time = int(time.time())
        validated_data["id"] = uuid.uuid4()
        validated_data["created_by_user"] = self.context["request"].user
        validated_data["server_created_at"] = current_time
        validated_data["updated_at"] = current_milli_time()
        validated_data["created_date"] = current_time

        alert = super().create(validated_data)
        alert.save()
        return alert

    def update(self, alert, validated_data):
        super().update(alert, validated_data)
        alert.unread_by_users = validated_data["unread_by_users"]
        alert.save()
        return alert


class AlertListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Alert
        fields = [
            "id",
            "subject",
            "priority",
            "alert_message",
            "unread_by_users",
            "created_by_user",
            "created_date",
        ]


class AlertSyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Alert
        fields = [
            "id",
            "subject",
            "priority",
            "alert_message",
            "unread_by_users",
            "created_by_user",
            "server_created_at",
            "updated_at",
            "created_date",
        ]

        read_only_fields = ["id"]


class editAlertSyncSerializer(serializers.ModelSerializer):
    # disable unique validator for id to allow POST push sync request to update records
    id = serializers.CharField(validators=[])

    class Meta:
        model = models.Alert
        fields = [
            "id",
            "subject",
            "priority",
            "alert_message",
            "unread_by_users",
            "created_by_user",
            "server_created_at",
            "updated_at",
            "created_date",
        ]


class deleteAlertSyncSerializer(serializers.ModelSerializer):
    # disable unique validator for id to allow POST push sync request to update records
    id = serializers.CharField(validators=[])

    class Meta:
        model = models.Alert
        fields = [
            "id",
        ]


# ensure to use a seperate serializer to disable primary key validator as it might invalidate it
class multiUserSerializer(serializers.Serializer):
    created = UserCBRSerializer(many=True)
    updated = editUserCBRSerializer(many=True)
    deleted = UserCBRSerializer(many=True)


class multiClientSerializer(serializers.Serializer):
    created = ClientSyncSerializer(many=True)
    updated = editClientSyncSerializer(many=True)
    deleted = ClientSyncSerializer(many=True)


class multiRiskSerializer(serializers.Serializer):
    created = ClientRiskSerializer(many=True)
    updated = ClientRiskSerializer(many=True)
    deleted = ClientRiskSerializer(many=True)


class multiBaselineSurveySerializer(serializers.Serializer):
    created = BaselineSurveySyncSerializer(many=True)
    updated = BaselineSurveySyncSerializer(many=True)
    deleted = BaselineSurveySyncSerializer(many=True)


class multiVisitSerializer(serializers.Serializer):
    created = SummaryVisitSerializer(many=True)
    updated = SummaryVisitSerializer(many=True)
    deleted = SummaryVisitSerializer(many=True)


class multiOutcomeSerializer(serializers.Serializer):
    created = OutcomeSyncSerializer(many=True)
    updated = OutcomeSyncSerializer(many=True)
    deleted = OutcomeSyncSerializer(many=True)


class multiImprovSerializer(serializers.Serializer):
    created = ImprovementSyncSerializer(many=True)
    updated = ImprovementSyncSerializer(many=True)
    deleted = ImprovementSyncSerializer(many=True)


class multiReferralSerializer(serializers.Serializer):
    created = ReferralSyncSerializer(many=True)
    updated = ReferralUpdateSerializer(many=True)
    deleted = ReferralSyncSerializer(many=True)


class multiAlertSerializer(serializers.Serializer):
    created = AlertSyncSerializer(many=True)
    updated = editAlertSyncSerializer(many=True)
    deleted = deleteAlertSyncSerializer(many=True)


# for each table being sync, add corresponding multi serializer under here
class tableSerializer(serializers.Serializer):
    users = multiUserSerializer()
    clients = multiClientSerializer()
    risks = multiRiskSerializer()
    referrals = multiReferralSerializer()
    surveys = multiBaselineSurveySerializer()
    visits = multiVisitSerializer()
    outcomes = multiOutcomeSerializer()
    improvements = multiImprovSerializer()
    alert = multiAlertSerializer()


class pullResponseSerializer(serializers.Serializer):
    changes = tableSerializer()
    timestamp = serializers.IntegerField()


class pushUserSerializer(serializers.Serializer):
    users = multiUserSerializer()

    def create(self, validated_data):
        create_user_data(validated_data, self.context.get("sync_time"))
        return self


class pushClientSerializer(serializers.Serializer):
    clients = multiClientSerializer()

    def create(self, validated_data):
        create_client_data(validated_data, self.context.get("sync_time"))
        return self


class pushRiskSerializer(serializers.Serializer):
    risks = multiRiskSerializer()

    def create(self, validated_data):
        create_generic_data(
            "risks", models.ClientRisk, validated_data, self.context.get("sync_time")
        )
        return self


class pushVisitSerializer(serializers.Serializer):
    visits = multiVisitSerializer()

    def create(self, validated_data):
        create_generic_data(
            "visits", models.Visit, validated_data, self.context.get("sync_time")
        )
        return self


class pushOutcomeImprovementSerializer(serializers.Serializer):
    outcomes = multiOutcomeSerializer()
    improvements = multiImprovSerializer()

    def create(self, validated_data):
        create_generic_data(
            "outcomes", models.Outcome, validated_data, self.context.get("sync_time")
        )
        create_generic_data(
            "improvements",
            models.Improvement,
            validated_data,
            self.context.get("sync_time"),
        )
        return self


class pushBaselineSurveySerializer(serializers.Serializer):
    surveys = multiBaselineSurveySerializer()

    def create(self, validated_data):
        create_survey_data(
            validated_data, self.context["user"], self.context.get("sync_time")
        )
        return self


class pushReferralSerializer(serializers.Serializer):
    referrals = multiReferralSerializer()

    def create(self, validated_data):
        create_referral_data(
            validated_data, self.context["user"], self.context.get("sync_time")
        )
        return self


class pushAlertSerializer(serializers.Serializer):
    alert = multiAlertSerializer()

    def create(self, validated_data):
        create_update_delete_alert_data(validated_data, self.context.get("sync_time"))
        return self


class VersionCheckSerializer(serializers.Serializer):
    api_version = serializers.CharField(required=True)

    def validate(self, data):
        version_levels = data["api_version"].split(".")
        if len(version_levels) != 3:
            raise serializers.ValidationError("Error!")

        for level in version_levels:
            if not isdigit(level):
                raise serializers.ValidationError("Error!")

        return data
