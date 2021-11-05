import datetime
import imghdr
import os
import time
import uuid
from typing import Optional

from django.contrib.auth.password_validation import validate_password
from django.core.files import File
from rest_framework import serializers

from cbr_api import models
from cbr_api.util import current_milli_time, create_push_data, create_push_referral


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
            raise serializers.ValidationError(
                {"detail": "Current password is incorrect"}
            )

        user.set_password(validated_data["new_password"])
        user.save()

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
        ]

        read_only_fields = ["client_id", "timestamp", "risk_type"]


class NormalRiskSerializer(serializers.ModelSerializer):
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
        ]

        read_only_fields = ["timestamp"]

    def create(self, validated_data):
        validated_data["timestamp"] = current_milli_time()
        validated_data["id"] = uuid.uuid4()
        print(validated_data)
        risk = models.ClientRisk.objects.create(**validated_data)
        risk.save()

        type = validated_data["risk_type"]
        level = validated_data["risk_level"]
        client = validated_data["client_id"]

        if type == models.RiskType.HEALTH:
            client.health_risk_level = level
        elif type == models.RiskType.SOCIAL:
            client.social_risk_level = level
        elif type == models.RiskType.EDUCAT:
            client.educat_risk_level = level

        client.save()

        return risk


class ImprovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Improvement
        fields = [
            "id",
            "visit",
            "risk_type",
            "provided",
            "desc",
        ]

        read_only_fields = ["visit"]


class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Outcome
        fields = [
            "id",
            "visit",
            "risk_type",
            "goal_met",
            "outcome",
        ]

        read_only_fields = ["visit"]


class UpdateReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Referral
        fields = [
            "date_resolved",
            "resolved",
            "outcome",
            "updated_at"
        ]

        read_only_fields = ["date_resolved"]

    def update(self, referral, validated_data):
        super().update(referral, validated_data)
        referral.resolved = validated_data["resolved"]
        current_time = int(time.time())
        if validated_data["resolved"] == True:
            referral.date_resolved = current_time
        else:
            referral.date_resolved = 0
        referral.outcome = validated_data["outcome"]
        referral.updated_at = current_time
        referral.save()
        return referral


class DetailedReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Referral
        fields = [
            "id",
            "user",
            "client",
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
            "services_other",
            "picture",
            "created_at",
            "updated_at"
        ]

        read_only_fields = [
            "user",
            "outcome",
            "date_referred",
            "date_resolved",
            "resolved",
            "created_at",
            "updated_at"
        ]

    def create(self, validated_data):
        current_time = int(time.time())
        validated_data["date_referred"] = current_time
        validated_date["created_at"] = current_time
        validated_data["user"] = self.context["request"].user
        referrals = models.Referral.objects.create(**validated_data)
        referrals.save()
        return referrals


class ReferralPullSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Referral
        fields = [
            "id",
            "client",
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
            "services_other",
            "picture",
            "created_at",
            "updated_at",
        ]


class OutstandingReferralSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    services_other = serializers.CharField()
    physiotherapy = serializers.BooleanField()
    wheelchair = serializers.BooleanField()
    prosthetic = serializers.BooleanField()
    orthotic = serializers.BooleanField()
    date_referred = serializers.IntegerField()


class DetailedVisitSerializer(serializers.ModelSerializer):
    improvements = ImprovementSerializer(many=True)
    outcomes = OutcomeSerializer(many=True)

    class Meta:
        model = models.Visit
        fields = [
            "id",
            "user",
            "client",
            "date_visited",
            "health_visit",
            "educat_visit",
            "social_visit",
            "longitude",
            "latitude",
            "zone",
            "village",
            "improvements",
            "outcomes",
        ]

        read_only_fields = ["user", "date_visited"]

    def create(self, validated_data):
        current_time = int(time.time())

        improvement_dataset = validated_data.pop("improvements")
        outcome_dataset = validated_data.pop("outcomes")

        validated_data["user"] = self.context["request"].user
        validated_data["date_visited"] = current_time
        visit = models.Visit.objects.create(**validated_data)
        visit.save()

        client = validated_data["client"]
        client.last_visit_date = current_time
        client.save()

        for improvement_data in improvement_dataset:
            improvement_data["visit"] = visit
            improvement = models.Improvement.objects.create(**improvement_data)
            improvement.save()

        for outcome_data in outcome_dataset:
            outcome_data["visit"] = visit
            outcome = models.Outcome.objects.create(**outcome_data)
            outcome.save()

        return visit


class SummaryVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Visit
        fields = [
            "id",
            "user",
            "client",
            "date_visited",
            "health_visit",
            "educat_visit",
            "social_visit",
            "longitude",
            "latitude",
            "zone",
            "village",
        ]


class AdminStatsVisitsSerializer(serializers.Serializer):
    zone_id = serializers.IntegerField()
    total = serializers.IntegerField()
    health_count = serializers.IntegerField()
    educat_count = serializers.IntegerField()
    social_count = serializers.IntegerField()


class AdminStatsReferralSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    wheelchair_count = serializers.IntegerField()
    physiotherapy_count = serializers.IntegerField()
    prosthetic_count = serializers.IntegerField()
    orthotic_count = serializers.IntegerField()
    other_count = serializers.IntegerField()


class AdminStatsDisabilitySerializer(serializers.Serializer):
    disability_id = serializers.IntegerField()
    total = serializers.IntegerField()


class AdminStatsSerializer(serializers.Serializer):
    disabilities = AdminStatsDisabilitySerializer(many=True, read_only=True)
    clients_with_disabilities = serializers.IntegerField()
    visits = AdminStatsVisitsSerializer(many=True, read_only=True)
    referrals_resolved = AdminStatsReferralSerializer(many=False, read_only=True)
    referrals_unresolved = AdminStatsReferralSerializer(many=False, read_only=True)


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
            "last_visit_date",
            "user_id",
        ]


class ClientPullSerializer(serializers.ModelSerializer):
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
            "zone",
            "village",
            "caregiver_name",
            "caregiver_phone",
            "caregiver_email",
            "health_risk_level",
            "social_risk_level",
            "educat_risk_level",
            "last_visit_date",
        ]


class BaselineSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BaselineSurvey
        fields = "__all__"

        read_only_fields = ["user", "survey_date"]

    def create(self, validated_data):
        current_time = int(time.time())
        validated_data["survey_date"] = current_time
        validated_data["user"] = self.context["request"].user
        baseline_survey = models.BaselineSurvey.objects.create(**validated_data)
        baseline_survey.save()
        return baseline_survey


class ClientCreateSerializer(serializers.ModelSerializer):
    health_risk = ClientCreationRiskSerializer(many=False, write_only=True)
    social_risk = ClientCreationRiskSerializer(many=False, write_only=True)
    educat_risk = ClientCreationRiskSerializer(many=False, write_only=True)

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
            "longitude",
            "latitude",
            "zone",
            "village",
            "picture",
            "caregiver_name",
            "caregiver_present",
            "caregiver_phone",
            "caregiver_email",
            "health_risk",
            "social_risk",
            "educat_risk",
        ]

        read_only_fields = [
            "user_id",
            "created_at",
            "updated_at",
            "full_name",
        ]

    def create(self, validated_data):
        print("creating client")
        # must be removed before passing validated_data into Client.objects.create
        health_data = validated_data.pop("health_risk")
        social_data = validated_data.pop("social_risk")
        educat_data = validated_data.pop("educat_risk")

        validated_data["health_risk_level"] = health_data["risk_level"]
        validated_data["social_risk_level"] = social_data["risk_level"]
        validated_data["educat_risk_level"] = educat_data["risk_level"]
        validated_data["full_name"] = (
            validated_data["first_name"] + " " + validated_data["last_name"]
        )
        validated_data["id"] = uuid.uuid4()
        validated_data["user_id"] = self.context["request"].user
        validated_data["created_at"] = current_milli_time()
        print("validated data")
        print(validated_data)
        client = super().create(validated_data)

        def create_risk(data, type):
            data["id"] = uuid.uuid4()
            data["client_id"] = client
            data["timestamp"] = current_milli_time()
            data["risk_type"] = type
            risk = models.ClientRisk.objects.create(**data)
            risk.save()

        create_risk(health_data, models.RiskType.HEALTH)
        create_risk(social_data, models.RiskType.SOCIAL)
        create_risk(educat_data, models.RiskType.EDUCAT)

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
            "picture",
            "caregiver_name",
            "caregiver_present",
            "caregiver_phone",
            "caregiver_email",
            "risks",
            "visits",
            "referrals",
            "baseline_surveys",
        ]

        read_only_fields = ["user_id", "created_at", "updated_at"]

    def update(self, instance: models.Client, validated_data):
        validated_data["updated_at"] = current_milli_time()
        print(validated_data)
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


# ensure to use a seperate serializer to disable primary key validator as it might invalidate it
class multiUserSerializer(serializers.Serializer):
    created = UserCBRSerializer(many=True)
    updated = editUserCBRSerializer(many=True)
    deleted = UserCBRSerializer(many=True)


class multiClientSerializer(serializers.Serializer):
    created = ClientPullSerializer(many=True)
    updated = ClientPullSerializer(many=True)
    deleted = ClientPullSerializer(many=True)


class multiRiskSerializer(serializers.Serializer):
    created = ClientCreationRiskSerializer(many=True)
    updated = ClientCreationRiskSerializer(many=True)
    deleted = ClientCreationRiskSerializer(many=True)


class multiReferralSerializer(serializers.Serializer):
    created = ReferralPullSerializer(many=True)
    updated = UpdateReferralSerializer(many=True)
    deleted = ReferralPullSerializer(many=True)

# for each table being sync, add corresponding multi serializer under here
class tableSerializer(serializers.Serializer):
    users = multiUserSerializer()
    clients = multiClientSerializer()
    risks = multiRiskSerializer()
    referrals = multiReferralSerializer()


class pullResponseSerializer(serializers.Serializer):
    changes = tableSerializer()
    timestamp = serializers.IntegerField()


class pushUserSerializer(serializers.Serializer):
    users = multiUserSerializer()

    def create(self, validated_data):
        create_push_data("users", models.UserCBR, validated_data)
        return self

class pushReferralSerializer(serializers.Serializer):
    referrals = multiReferralSerializer()

    def create(self, validated_data):
        create_push_referral("referrals", models.Referral, validated_data, self.context["user"])
        return self