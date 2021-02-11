from rest_framework import serializers
from cbr_api import models
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
import time


class UserSerializer(serializers.ModelSerializer):
    # username = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = models.User
        fields = ("username", "password", "first_name", "last_name")
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def create(self, validated_data):
        user = models.User.objects.create(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        user.set_password(validated_data["password"])
        user.save()

        return user


class ClientSerializer(serializers.ModelSerializer):
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
        ]

        read_only_fields = ["created_by_user", "created_date"]

    def create(self, validated_data):
        validated_data["created_by_user"] = self.context["request"].user
        validated_data["created_date"] = int(time.time())
        client = models.Client.objects.create(**validated_data)
        client.save()

        return client


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Zone
        fields = [
            "id",
            "zone_name",
        ]


class RiskSerializer(serializers.ModelSerializer):
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
