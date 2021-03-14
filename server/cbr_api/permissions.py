from cbr_api import models
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user and
                request.user.is_authenticated and
                request.user.role == models.UserCBR.Role.ADMIN)