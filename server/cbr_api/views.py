import os
import time
import json

from django.http import HttpResponse, HttpResponseNotFound
from django.views.decorators.cache import cache_control
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import generics
from rest_framework import status
from rest_framework_condition import condition
from rest_framework.decorators import api_view
from rest_framework.response import Response

from cbr.settings import DEBUG
from cbr_api import models, serializers, filters, permissions
from cbr_api.sql import (
    getDisabilityStats,
    getNumClientsWithDisabilities,
    getVisitStats,
    getReferralStats,
    getOutstandingReferrals,
)
from cbr_api.util import client_picture_last_modified_datetime, client_image_etag
from downloadview.object import AuthenticatedObjectDownloadView
from cbr_api.util import (
    syncResp,
    get_model_changes,
    stringify_disability,
    destringify_disability,
    decode_image,
)


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

    @extend_schema(
        parameters=[
            OpenApiParameter(name="user_id", type={"type": "int"}),
            OpenApiParameter(name="from", type={"type": "int"}),
            OpenApiParameter(name="to", type={"type": "int"}),
        ]
    )
    def get(self, request):
        return super().get(request)

    def get_object(self):
        def get_int_or_none(req_body_key):
            val = self.request.GET.get(req_body_key, "")
            return int(val) if val != "" else None

        user_id = get_int_or_none("user_id")
        from_time = get_int_or_none("from")
        to_time = get_int_or_none("to")

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


class ClientImage(AuthenticatedObjectDownloadView):
    model = models.Client
    file_field = "picture"

    @extend_schema(
        description="Gets the profile picture for a client if it exists.",
        responses={(200, "image/*"): OpenApiTypes.BINARY, 304: None, 404: None},
    )
    @cache_control(max_age=1209600, no_cache=True, private=True)
    def get(self, request, pk):
        if DEBUG:
            # We're not using Caddy in debug environments, so let Django stream it via downloadview.
            # Caddy will add ETag and Last-Modified headers for us, so only apply this decorator in DEBUG mode.
            @condition(
                last_modified_func=client_picture_last_modified_datetime,
                etag_func=client_image_etag,
            )
            def super_get(self_new, request_new, pk_new):
                return super().get(self_new, request_new, pk_new)

            return super_get(self, request, pk)

        client = models.Client.objects.get(pk=pk)
        if client:
            if len(client.picture.name) <= 0:
                return HttpResponseNotFound()

            dir_name, file_name = os.path.split(client.picture.name)
            response = HttpResponse()
            # Redirect the image request to Caddy.
            response["X-Accel-Redirect"] = client.picture.name
            response["Content-Disposition"] = f'attachment; filename="{file_name}"'
            return response
        else:
            return HttpResponseNotFound()


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


class ReferralImage(AuthenticatedObjectDownloadView):
    model = models.Referral
    file_field = "picture"

    @extend_schema(
        description="Gets the wheelchair image of referral if it exists.",
        responses={(200, "image/*"): OpenApiTypes.BINARY, 304: None, 404: None},
    )
    @cache_control(max_age=1209600, no_cache=True, private=True)
    def get(self, request, pk):
        if DEBUG:

            def super_get(self_new, request_new, pk_new):
                return super().get(self_new, request_new, pk_new)

            return super_get(self, request, pk)

        referral = models.Referral.objects.get(pk=pk)
        if referral:
            if len(referral.picture.name) <= 0:
                return HttpResponseNotFound()

            dir_name, file_name = os.path.split(referral.picture.name)
            response = HttpResponse()
            # Redirect the image request to Caddy.
            response["X-Accel-Redirect"] = referral.picture.name
            response["Content-Disposition"] = f'attachment; filename="{file_name}"'
            return response
        else:
            return HttpResponseNotFound()


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


class BaselineSurveyCreate(generics.CreateAPIView):
    queryset = models.BaselineSurvey.objects.all()
    serializer_class = serializers.BaselineSurveySerializer


class ReferralOutstanding(generics.ListAPIView):
    serializer_class = serializers.OutstandingReferralSerializer

    def get_queryset(self):
        return getOutstandingReferrals()


@api_view(["GET", "POST"])
def sync(request):
    if request.method == "GET":
        reply = syncResp()
        reply.changes["users"] = get_model_changes(request, models.UserCBR)
        reply.changes["clients"] = get_model_changes(request, models.Client)
        reply.changes["risks"] = get_model_changes(request, models.ClientRisk)
        reply.changes["visits"] = get_model_changes(request, models.Visit)
        reply.changes["outcomes"] = get_model_changes(request, models.Outcome)
        reply.changes["improvements"] = get_model_changes(request, models.Improvement)
        serialized = serializers.pullResponseSerializer(reply)
        stringify_disability(serialized.data)
        return Response(serialized.data)
    else:
        sync_time = request.GET.get("last_pulled_at", "")
        user_serializer = serializers.pushUserSerializer(
            data=request.data, context={"sync_time": sync_time}
        )
        if user_serializer.is_valid():
            user_serializer.save()
            destringify_disability(request.data)
            decode_image(request.data["clients"])
            client_serializer = serializers.pushClientSerializer(
                data=request.data, context={"sync_time": sync_time}
            )
            if client_serializer.is_valid():
                client_serializer.save()
                risk_serializer = serializers.pushRiskSerializer(
                    data=request.data, context={"sync_time": sync_time}
                )
                if risk_serializer.is_valid():
                    risk_serializer.save()
                    visit_serializer = serializers.pushVisitSerializer(
                        data=request.data, context={"sync_time": sync_time}
                    )
                    if visit_serializer.is_valid():
                        visit_serializer.save()
                        outcome_improvment_serializer = (
                            serializers.pushOutcomeImprovementSerializer(
                                data=request.data, context={"sync_time": sync_time}
                            )
                        )
                        if outcome_improvment_serializer.is_valid():
                            outcome_improvment_serializer.save()
                            return Response(status=status.HTTP_201_CREATED)
                        else:
                            print(outcome_improvment_serializer.errors)
                    else:
                        print(visit_serializer.errors)
                else:
                    print(risk_serializer.errors)
            else:
                print(client_serializer.errors)
        else:
            print(user_serializer.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST)
