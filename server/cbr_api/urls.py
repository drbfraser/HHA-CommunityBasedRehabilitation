from django.urls import path
from cbr_api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/create/", views.UserCreate.as_view(), name="user_create"),
    path("clients", views.ClientList.as_view(), name="client-list"),
    path("client/<int:pk>", views.ClientDetail.as_view(), name="client-detail"),
    path("zones", views.ZoneList.as_view(), name="zone-list"),
    path("zone/<int:pk>", views.ZoneDetail.as_view(), name="zone-detail"),
]
