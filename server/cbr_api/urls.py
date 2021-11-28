from django.urls import path
from django.conf.urls import url
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from cbr_api import views
from downloadview.object import AuthenticatedObjectDownloadView

urlpatterns = [
    path("login", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("login/refresh", TokenRefreshView.as_view(), name="token-refresh"),
    path("users", views.UserList.as_view(), name="user-list"),
    path("user/<str:pk>", views.UserDetail.as_view(), name="user-detail"),
    path("user/password/<str:pk>", views.UserPassword.as_view(), name="user-password"),
    path("currentuser/", views.UserCurrent.as_view(), name="user-current"),
    path(
        "user/password/current",
        views.UserCurrentPassword.as_view(),
        name="user-current-password",
    ),
    path("clients", views.ClientList.as_view(), name="client-list"),
    path("client/<str:pk>", views.ClientDetail.as_view(), name="client-detail"),
    path(
        "client/picture/<str:pk>",
        views.ClientImage.as_view(),
        name="client-picture",
    ),
    path("zones", views.ZoneList.as_view(), name="zone-list"),
    path("zone/<int:pk>", views.ZoneDetail.as_view(), name="zone-detail"),
    path("risks", views.RiskList.as_view(), name="risk-list"),
    path("risk/<str:pk>", views.RiskDetail.as_view(), name="risk-detail"),
    path("disabilities", views.DisabilityList.as_view(), name="disability-list"),
    path(
        "disability/<int:pk>",
        views.DisabilityDetail.as_view(),
        name="disability-detail",
    ),
    path("visits", views.VisitList.as_view(), name="visit-list"),
    path("visit/<str:pk>", views.VisitDetail.as_view(), name="visit-detail"),
    path("referral/<str:pk>", views.ReferralDetail.as_view(), name="referral-detail"),
    path("referrals", views.ReferralList.as_view(), name="referral-list"),
    path(
        "referral/picture/<str:pk>",
        views.ReferralImage.as_view(),
        name="referral-picture",
    ),
    path(
        "referrals/outstanding",
        views.ReferralOutstanding.as_view(),
        name="referral-outstanding",
    ),
    path("stats", views.AdminStats.as_view(), name="admin-stats"),
    path(
        "baselinesurveys",
        views.BaselineSurveyCreate.as_view(),
        name="baseline-survey-list",
    ),
    path("alerts", views.AlertList.as_view(), name="alert-list"),
    path("alert/<str:pk>", views.AlertDetail.as_view(), name="alert-detail"),
    url(r"^sync/$", views.sync, name="sync"),
]
