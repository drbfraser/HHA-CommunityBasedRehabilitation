from rest_framework import serializers
from cbr_api import models
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    #username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = models.User
        fields = ('username', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = models.User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

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
