from rest_framework import serializers
from cbr_api import models
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
import time


class UserCBRSerializer(serializers.ModelSerializer):
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
            "zone",
            "phone_number",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "zone": {"required": True},
        }

    def create(self, validated_data):
        user = super().create(validated_data)

        user.set_password(validated_data["password"])
        user.save()

        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)

        user.set_password(validated_data["password"])
        user.save()

        return user


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Zone
        fields = [
            "id",
            "zone_name",
        ]


class ClientCreationRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClientRisk
        fields = [
            "id",
            "client",
            "timestamp",
            "risk_type",
            "risk_level",
            "requirement",
            "goal",
        ]

        read_only_fields = ["client", "timestamp", "risk_type"]


class NormalRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClientRisk
        fields = [
            "id",
            "client",
            "timestamp",
            "risk_type",
            "risk_level",
            "requirement",
            "goal",
        ]

        read_only_fields = ["timestamp"]

    def create(self, validated_data):
        validated_data["timestamp"] = int(time.time())
        risk = models.ClientRisk.objects.create(**validated_data)
        risk.save()

        type = validated_data["risk_type"]
        level = validated_data["risk_level"]
        client = validated_data["client"]

        if type == models.RiskType.HEALTH:
            client.health_risk_level = level
        elif type == models.RiskType.SOCIAL:
            client.social_risk_level = level
        elif type == models.RiskType.EDUCAT:
            client.educat_risk_level = level

        client.save()

        return risk


class ClientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "zone",
            "health_risk_level",
            "social_risk_level",
            "educat_risk_level",
        ]


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
            "created_by_user",
            "created_date",
            "longitude",
            "latitude",
            "zone",
            "village",
            "picture",
            "caregiver_present",
            "caregiver_phone",
            "caregiver_email",
            "caregiver_picture",
            "health_risk",
            "social_risk",
            "educat_risk",
        ]

        read_only_fields = ["created_by_user", "created_date", "full_name"]

    def create(self, validated_data):
        current_time = int(time.time())

        # must be removed before passing validated_data into Client.objects.create
        health_data = validated_data.pop("health_risk")
        social_data = validated_data.pop("social_risk")
        educat_data = validated_data.pop("educat_risk")

        validated_data["health_risk_level"] = health_data["risk_level"]
        validated_data["social_risk_level"] = social_data["risk_level"]
        validated_data["educat_risk_level"] = educat_data["risk_level"]
        validated_data["full_name"] = validated_data["first_name"] + " " + validated_data["last_name"]
        validated_data["created_by_user"] = self.context["request"].user
        validated_data["created_date"] = current_time
        client = models.Client.objects.create(**validated_data)
        client.save()

        def create_risk(data, type):
            data["client"] = client
            data["timestamp"] = current_time
            data["risk_type"] = type
            risk = models.ClientRisk.objects.create(**data)
            risk.save()

        create_risk(health_data, models.RiskType.HEALTH)
        create_risk(social_data, models.RiskType.SOCIAL)
        create_risk(educat_data, models.RiskType.EDUCAT)

        return client


class ClientDetailSerializer(serializers.ModelSerializer):
    risks = ClientCreationRiskSerializer(many=True, read_only=True)

    class Meta:
        model = models.Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "birth_date",
            "gender",
            "phone_number",
            "created_by_user",
            "created_date",
            "longitude",
            "latitude",
            "zone",
            "village",
            "picture",
            "caregiver_present",
            "caregiver_phone",
            "caregiver_email",
            "caregiver_picture",
            "risks",
        ]

        read_only_fields = ["created_by_user", "created_date"]
