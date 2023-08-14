from cbr_api import models
from rest_framework import permissions
from cbr import settings
import logging

logging.config.dictConfig(settings.LOGGING)
logger = logging.getLogger(__name__)


def is_authenticated(request, view):
    return permissions.IsAuthenticated().has_permission(request, view)


def is_admin(request, view):
    return (
        is_authenticated(request, view)
        and request.user.role == models.UserCBR.Role.ADMIN
    )


class AdminAll(permissions.BasePermission):
    def has_permission(self, request, view):
        hasPermissions = is_admin(request, view)
        if hasPermissions != True:
            logger.info(
                "Failed attempt to access admin privileges from user %s",
                self.request.user.username,
            )
        return is_admin(request, view)


class AdminCreateUpdateDestroy(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "GET":
            return is_authenticated(request, view)
        else:
            hasPermissions = is_admin(request, view)
            if hasPermissions != True:
                logger.info(
                    "Attempt to create/update/destroy without admin privileges from user %s",
                    self.request.user.username,
                )
            return is_admin(request, view)
