from django.contrib.auth.signals import user_login_failed
from django.dispatch import receiver
from cbr import settings
import logging

logging.config.dictConfig(settings.LOGGING)
logger = logging.getLogger(__name__)


@receiver(user_login_failed)
def log_failed_login(sender, credentials, **kwargs):
    username = credentials.get("username")
    logger.warning("Failed login attempt for username: %s", username)
