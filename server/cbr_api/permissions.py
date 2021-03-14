from cbr_api import models
from rest_framework import permissions


def is_authenticated(request, view):
    return permissions.IsAuthenticated().has_permission(request, view)


def is_admin(request, view):
    return (
        is_authenticated(request, view)
        and request.user.role == models.UserCBR.Role.ADMIN
    )


class AdminAll(permissions.BasePermission):
    def has_permission(self, request, view):
        return is_admin(request, view)


class AdminCreateUpdateDestroy(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "GET":
            return is_authenticated(request, view)
        else:
            return is_admin(request, view)
