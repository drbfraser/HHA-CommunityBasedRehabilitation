from django.http import JsonResponse
from django.views.generic.list import ListView
from rest_framework.permissions import IsAuthenticated
from cbr_api import models
from cbr_api import serializers
from rest_framework import generics
from django.contrib.auth.models import User


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer

class ClientList(generics.ListCreateAPIView):
    queryset = models.Client.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClientSerializer

class ClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Client.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClientSerializer

class ZoneList(generics.ListCreateAPIView):
    queryset = models.Zone.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ZoneSerializer

class ZoneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Zone.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ZoneSerializer
