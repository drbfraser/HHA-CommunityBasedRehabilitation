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
    path("clients", views.ClientList.as_view(), name="client-list"),
    path("client/<int:pk>", views.ClientDetail.as_view(), name="client-detail"),
    path("zones", views.ZoneList.as_view(), name="zone-list"),
    path("zone/<int:pk>", views.ZoneDetail.as_view(), name="zone-detail"),
    path("risks", views.RiskList.as_view(), name="risk-list"),
    path("risk/<int:pk>", views.RiskDetail.as_view(), name="risk-detail"),
]
