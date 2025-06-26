import os

from django.http import HttpResponse, HttpResponseNotFound
from django.views.decorators.cache import cache_control
from django.utils.decorators import method_decorator
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
    getNewClients,
    getFollowUpVisits,
)
from cbr_api.util import client_picture_last_modified_datetime, client_image_etag
from downloadview.object import AuthenticatedObjectDownloadView
from cbr_api.util import (
    syncResp,
    get_model_changes,
    stringify_disability,
    destringify_disability,
    decode_image,
    api_versions_compatible,
    stringify_unread_users,
    destringify_unread_users,
    string_of_id_to_dictionary,
)
from cbr import settings
import logging

logging.config.dictConfig(settings.LOGGING)
logger = logging.getLogger(__name__)


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
            OpenApiParameter(name="is_active", type={"type": "boolean"}),
        ]
    )
    def get(self, request):
        return super().get(request)

    def get_object(self):
        def get_int_or_none(req_body_key):
            val = self.request.GET.get(req_body_key, "")
            return int(val) if val != "" else None

        def get_str_or_none(req_body_key):
            val = self.request.GET.get(req_body_key, "")
            return val if val != "" else None

        def get_boolean_or_none(req_body_key):
            val = self.request.GET.get(req_body_key, "")
            if val == "true":
                return True
            else:
                return False

        user_id = get_str_or_none("user_id")
        from_time = get_int_or_none("from")
        to_time = get_int_or_none("to")
        is_active = get_boolean_or_none("is_active")

        referral_stats = getReferralStats(user_id, from_time, to_time, is_active)

        return {
            "disabilities": getDisabilityStats(user_id, from_time, to_time, is_active),
            "clients_with_disabilities": getNumClientsWithDisabilities(
                user_id, from_time, to_time, is_active
            ),
            "visits": getVisitStats(user_id, from_time, to_time, is_active),
            "referrals_resolved": referral_stats["resolved"],
            "referrals_unresolved": referral_stats["unresolved"],
            "new_clients": getNewClients(user_id, from_time, to_time, is_active),
            "follow_up_visits": getFollowUpVisits(
                user_id, from_time, to_time, is_active
            ),
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
        print("POST 1")
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


@method_decorator(
    cache_control(max_age=1209600, no_cache=True, private=True), name="dispatch"
)
class ClientImage(AuthenticatedObjectDownloadView):
    model = models.Client
    file_field = "picture"

    @extend_schema(
        description="Gets the profile picture for a client if it exists.",
        responses={(200, "image/*"): OpenApiTypes.BINARY, 304: None, 404: None},
    )
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
            # Currently skipping caddy to serve images. Stream directly from Django
            # dir_name, file_name = os.path.split(client.picture.name)
            # response = HttpResponse()
            # # Redirect the image request to Caddy.
            # response["X-Accel-Redirect"] = client.picture.name
            # response["Content-Disposition"] = f'attachment; filename="{file_name}"'
            return super().get(self, request, pk)
        #     return response
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


class ZoneMigrationView(generics.RetrieveUpdateDestroyAPIView):
    def get(self, request, source_zone, target_zone):
        try:
            source_zone = int(source_zone)
            target_zone = int(target_zone)
        except ValueError:
            return Response(
                {"error": "Invalid zone IDs provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            source_zone_clients = ClientList.queryset.filter(zone=source_zone)
            source_zone_visits = VisitList.queryset.filter(zone=source_zone)
            source_zone_users = UserList.queryset.filter(zone=source_zone)
            source_zone_clients.update(zone=target_zone)
            source_zone_visits.update(zone=target_zone)
            source_zone_users.update(zone=target_zone)
            logger.info(
                "Zone %s deleted by user %s and data migrated to zone %s",
                source_zone,
                self.request.user.username,
                target_zone,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": "Zone migration completed successfully"},
            status=status.HTTP_200_OK,
        )


class RiskList(generics.ListCreateAPIView):
    queryset = models.ClientRisk.objects.all()
    serializer_class = serializers.NormalRiskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        client_id = self.request.query_params.get("client_id")
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        return queryset
    

class RiskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ClientRisk.objects.all()
    serializer_class = serializers.NormalRiskSerializer


class VisitList(generics.CreateAPIView):
    print("! -- VisitList")
    queryset = models.Visit.objects.all()
    serializer_class = serializers.DetailedVisitSerializer


class VisitDetail(generics.RetrieveAPIView):
    print("! -- VisitDetail")
    queryset = models.Visit.objects.all()
    serializer_class = serializers.DetailedVisitSerializer


@method_decorator(
    cache_control(max_age=1209600, no_cache=True, private=True), name="dispatch"
)
class ReferralImage(AuthenticatedObjectDownloadView):
    model = models.Referral
    file_field = "picture"

    @extend_schema(
        description="Gets the wheelchair image of referral if it exists.",
        responses={(200, "image/*"): OpenApiTypes.BINARY, 304: None, 404: None},
    )
    def get(self, request, pk):
        if DEBUG:

            def super_get(self_new, request_new, pk_new):
                return super().get(self_new, request_new, pk_new)

            return super_get(self, request, pk)

        referral = models.Referral.objects.get(pk=pk)
        if referral:
            if len(referral.picture.name) <= 0:
                return HttpResponseNotFound()

            # dir_name, file_name = os.path.split(referral.picture.name)
            # response = HttpResponse()
            # # Redirect the image request to Caddy.
            # response["X-Accel-Redirect"] = referral.picture.name
            # response["Content-Disposition"] = f'attachment; filename="{file_name}"'
            # return response
            return super().get(self, request, pk)
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


class ReferralListALl(generics.ListAPIView):
    queryset = models.Referral.objects.all()
    serializer_class = serializers.DetailedReferralSerializer


class AlertList(generics.ListCreateAPIView):
    queryset = models.Alert.objects.all()

    @extend_schema(responses=serializers.AlertListSerializer)
    def get(self, request):
        return super().get(request)

    @extend_schema(
        request=serializers.AlertSerializer,
        responses=serializers.AlertSerializer,
    )
    def post(self, request):
        return super().post(request)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return serializers.AlertListSerializer
        elif self.request.method == "POST":
            return serializers.AlertSerializer


class AlertDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Alert.objects.all()
    serializer_class = serializers.AlertSerializer

    @extend_schema(
        request=serializers.AlertSerializer,
        responses=serializers.AlertSerializer,
    )
    def put(self, alert, pk):
        return super().put(alert)

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return serializers.AlertSerializer


@api_view(["GET", "POST"])
def sync(request):
    mobileApiVersion = request.GET.get("api_version")

    if mobileApiVersion == None or not api_versions_compatible(mobileApiVersion):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        reply = syncResp()
        reply.changes["users"] = get_model_changes(request, models.UserCBR)
        reply.changes["clients"] = get_model_changes(request, models.Client)
        reply.changes["risks"] = get_model_changes(request, models.ClientRisk)
        reply.changes["referrals"] = get_model_changes(request, models.Referral)
        reply.changes["surveys"] = get_model_changes(request, models.BaselineSurvey)
        reply.changes["visits"] = get_model_changes(request, models.Visit)
        reply.changes["outcomes"] = get_model_changes(request, models.Outcome)
        reply.changes["improvements"] = get_model_changes(request, models.Improvement)
        reply.changes["alert"] = get_model_changes(request, models.Alert)
        serialized = serializers.pullResponseSerializer(reply)
        stringify_disability(serialized.data)
        stringify_unread_users(serialized.data)
        return Response(serialized.data)
    else:
        sync_time = request.GET.get("last_pulled_at", "")

        def validation_fail(serializer):
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user_serializer = serializers.pushUserSerializer(
            data=request.data, context={"sync_time": sync_time}
        )
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            validation_fail(user_serializer)

        destringify_disability(request.data)
        decode_image(request.data["clients"])
        client_serializer = serializers.pushClientSerializer(
            data=request.data, context={"sync_time": sync_time}
        )
        if client_serializer.is_valid():
            client_serializer.save()
        else:
            validation_fail(client_serializer)

        risk_serializer = serializers.pushRiskSerializer(
            data=request.data, context={"sync_time": sync_time}
        )
        if risk_serializer.is_valid():
            risk_serializer.save()
        else:
            validation_fail(risk_serializer)

        decode_image(request.data["referrals"])
        referral_serializer = serializers.pushReferralSerializer(
            data=request.data,
            context={"sync_time": sync_time, "user": request.user},
        )
        if referral_serializer.is_valid():
            referral_serializer.save()
        else:
            validation_fail(referral_serializer)

        survey_serializer = serializers.pushBaselineSurveySerializer(
            data=request.data,
            context={"sync_time": sync_time, "user": request.user},
        )
        if survey_serializer.is_valid():
            survey_serializer.save()
        else:
            validation_fail(survey_serializer)

        visit_serializer = serializers.pushVisitSerializer(
            data=request.data, context={"sync_time": sync_time}
        )
        if visit_serializer.is_valid():
            visit_serializer.save()
        else:
            validation_fail(visit_serializer)

        outcome_improvment_serializer = serializers.pushOutcomeImprovementSerializer(
            data=request.data,
            context={"sync_time": sync_time},
        )
        if outcome_improvment_serializer.is_valid():
            outcome_improvment_serializer.save()
        else:
            validation_fail(outcome_improvment_serializer)

        destringify_unread_users(request.data)
        string_of_id_to_dictionary(request.data, "alert")

        alert_serializer = serializers.pushAlertSerializer(
            data=request.data,
            context={"sync_time": sync_time},
        )
        if alert_serializer.is_valid():
            alert_serializer.save()
        else:
            validation_fail(alert_serializer)

        return Response(status=status.HTTP_201_CREATED)


@api_view(["POST"])
def version_check(request):
    serializer = serializers.VersionCheckSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if api_versions_compatible(serializer.data["api_version"]):
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)
