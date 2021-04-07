from cbr_api import models, serializers, filters, permissions
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from cbr_api.sql import (
    getDisabilityStats,
    getNumClientsWithDisabilities,
    getVisitStats,
    getReferralStats,
)
import json


class UserList(generics.ListCreateAPIView):
    permission_classes = [permissions.AdminAll]
    queryset = models.UserCBR.objects.all()
    serializer_class = serializers.UserCBRCreationSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AdminAll]
    queryset = models.UserCBR.objects.all()
    serializer_class = serializers.UserCBRSerializer


class AdminStats(generics.RetrieveAPIView):
    permission_classes = [permissions.AdminAll]
    serializer_class = serializers.AdminStatsSerializer

    def get_object(self):
        def get_int_or_none(req_body_key):
            try:
                return int(json.loads(self.request.body)[req_body_key])
            except:
                return None

        user_id = get_int_or_none("user_id")
        from_time = get_int_or_none("from_time")
        to_time = get_int_or_none("to_time")

        referral_stats = getReferralStats(user_id, from_time, to_time)

        return {
            "disabilities": getDisabilityStats(),
            "clients_with_disabilities": getNumClientsWithDisabilities(),
            "visits": getVisitStats(user_id, from_time, to_time),
            "referrals_resolved": referral_stats["resolved"],
            "referrals_unresolved": referral_stats["unresolved"],
        }


class UserCurrent(generics.RetrieveAPIView):
    queryset = models.UserCBR.objects.all()
    serializer_class = serializers.UserCBRSerializer

    def get_object(self):
        return generics.get_object_or_404(self.queryset, id=self.request.user.id)


class UserPassword(generics.UpdateAPIView):
    permission_classes = [permissions.AdminAll]
    queryset = models.UserCBR.objects.all()
    serializer_class = serializers.UserPasswordSerializer
    http_method_names = ["put"]


class UserCurrentPassword(generics.UpdateAPIView):
    queryset = models.UserCBR.objects.all()
    serializer_class = serializers.UserCurrentPasswordSerializer
    http_method_names = ["put"]

    def get_object(self):
        return generics.get_object_or_404(self.queryset, id=self.request.user.id)


class ClientList(generics.ListCreateAPIView):
    queryset = models.Client.objects.all()

    @extend_schema(responses=serializers.ClientListSerializer)
    def get(self, request):
        return super().get(request)

    @extend_schema(
        request=serializers.ClientCreateSerializer,
        responses=serializers.ClientCreateSerializer,
    )
    def post(self, request):
        return super().post(request)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return serializers.ClientListSerializer
        elif self.request.method == "POST":
            return serializers.ClientCreateSerializer

    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ClientFilter


class ClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Client.objects.all()
    serializer_class = serializers.ClientDetailSerializer


class DisabilityList(generics.ListCreateAPIView):
    queryset = models.Disability.objects.all()
    serializer_class = serializers.DisabilitySerializer


class DisabilityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Disability.objects.all()
    serializer_class = serializers.DisabilitySerializer


class ZoneList(generics.ListCreateAPIView):
    permission_classes = [permissions.AdminCreateUpdateDestroy]
    queryset = models.Zone.objects.all()
    serializer_class = serializers.ZoneSerializer


class ZoneDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AdminCreateUpdateDestroy]
    queryset = models.Zone.objects.all()
    serializer_class = serializers.ZoneSerializer


class RiskList(generics.ListCreateAPIView):
    queryset = models.ClientRisk.objects.all()
    serializer_class = serializers.NormalRiskSerializer


class RiskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ClientRisk.objects.all()
    serializer_class = serializers.NormalRiskSerializer


class VisitList(generics.CreateAPIView):
    queryset = models.Visit.objects.all()
    serializer_class = serializers.DetailedVisitSerializer


class VisitDetail(generics.RetrieveAPIView):
    queryset = models.Visit.objects.all()
    serializer_class = serializers.DetailedVisitSerializer


class ReferralList(generics.CreateAPIView):
    queryset = models.Referral.objects.all()
    serializer_class = serializers.DetailedReferralSerializer


class ReferralDetail(generics.RetrieveUpdateAPIView):
    queryset = models.Referral.objects.all()
    http_method_names = ["get", "put"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return serializers.DetailedReferralSerializer
        elif self.request.method == "PUT":
            return serializers.UpdateReferralSerializer

    @extend_schema(
        responses=serializers.DetailedReferralSerializer,
    )
    def get(self, request, pk):
        return super().get(request)

    @extend_schema(
        request=serializers.UpdateReferralSerializer,
        responses=serializers.UpdateReferralSerializer,
    )
    def put(self, request, pk):
        return super().put(request)

class BaselineSurveyList(generics.CreateAPIView):
    queryset = models.BaselineSurvey.objects.all()
    serializer_class = serializers.BaselineSurveySerializer


class BaselineSurveyDetail(generics.RetrieveAPIView):
    queryset = models.BaselineSurvey.objects.all()
    serializer_class = serializers.BaselineSurveySerializer
