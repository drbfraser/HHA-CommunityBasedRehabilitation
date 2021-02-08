from rest_framework import serializers
from cbr_api import models


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = [
            "client_id",
            "created_by_user_id",
            "birth_date",
            "first_name",
            "last_name",
            "gender",
            "register_date",
            "phone_number",
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


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Zone
        fields = [
            "zone_name",
        ]
