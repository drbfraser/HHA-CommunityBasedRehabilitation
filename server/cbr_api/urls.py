from django.urls import path
from cbr_api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("login", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("login/refresh", TokenRefreshView.as_view(), name="token-refresh"),
    path("users", views.UserList.as_view(), name="user-list"),
    path("user/<int:pk>", views.UserDetail.as_view(), name="user-detail"),
    path("user/<int:pk>/password", views.UserPassword.as_view(), name="user-password"),
    path("user/current", views.UserCurrent.as_view(), name="user-current"),
    path(
        "user/current/password",
        views.UserCurrentPassword.as_view(),
        name="user-current-password",
    ),
    path("clients", views.ClientList.as_view(), name="client-list"),
    path("client/<int:pk>", views.ClientDetail.as_view(), name="client-detail"),
    path("zones", views.ZoneList.as_view(), name="zone-list"),
    path("zone/<int:pk>", views.ZoneDetail.as_view(), name="zone-detail"),
    path("risks", views.RiskList.as_view(), name="risk-list"),
    path("risk/<int:pk>", views.RiskDetail.as_view(), name="risk-detail"),
    path("disabilities", views.DisabilityList.as_view(), name="disability-list"),
    path(
        "disability/<int:pk>",
        views.DisabilityDetail.as_view(),
        name="disability-detail",
    ),
    path("visits", views.VisitList.as_view(), name="visit-list"),
    path("visit/<int:pk>", views.VisitDetail.as_view(), name="visit-detail"),
    path("referral/<int:pk>", views.ReferralDetail.as_view(), name="referral-detail"),
    path("referrals", views.ReferralList.as_view(), name="referral-list"),
    #path("stats", views.user_list, name="admin-stats"),
    path("stats", views.AdminStats.as_view(), name="admin-stats"),
]
