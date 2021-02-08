from django.urls import path
from cbr_api import views

urlpatterns = [
    path("clients", views.ClientList.as_view(), name="client-list"),
    path("client/<int:pk>", views.ClientDetail.as_view(), name="client-detail"),
    path("zones", views.ZoneList.as_view(), name="zone-list"),
    path("zone/<int:pk>", views.ZoneDetail.as_view(), name="zone-detail"),
]
