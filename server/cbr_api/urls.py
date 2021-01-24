from django.urls import path
from cbr_api import views

urlpatterns = [
    path("example", views.example),
]
