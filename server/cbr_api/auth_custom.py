from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from cbr import settings
import logging

logging.config.dictConfig(settings.LOGGING)
logger = logging.getLogger(__name__)

User = get_user_model()


class CustomModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        logger.info("auth")
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)

        # Try the original username and password first
        user = super().authenticate(request, username, password, **kwargs)

        if user is None:
            logger.info(
                "Login failed with username: %s. Retrying with all lowercase.", username
            )
            # Retry with lowercase username
            lowercase_username = username.lower()
            user = super().authenticate(request, lowercase_username, password, **kwargs)
            if user:
                logger.info(
                    "Successful login with lowercase username for: %s",
                    lowercase_username,
                )

        return user
