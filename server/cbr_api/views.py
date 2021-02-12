from cbr_api import models
from cbr_api import serializers
from rest_framework import generics
from django.contrib.auth.models import User


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    # TODO: remove once we have a seed script that adds a default user (i.e. require authentication)
    permission_classes = []
    serializer_class = serializers.UserSerializer


class ClientList(generics.ListCreateAPIView):
    queryset = models.Client.objects.all()
    serializer_class = serializers.ClientSerializer


class ClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Client.objects.all()
    serializer_class = serializers.ClientSerializer


class ZoneList(generics.ListCreateAPIView):
    queryset = models.Zone.objects.all()
    serializer_class = serializers.ZoneSerializer


class ZoneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Zone.objects.all()
    serializer_class = serializers.ZoneSerializer


class RiskList(generics.ListCreateAPIView):
    queryset = models.ClientRisk.objects.all()
    serializer_class = serializers.RiskSerializer


class RiskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ClientRisk.objects.all()
    serializer_class = serializers.RiskSerializer
