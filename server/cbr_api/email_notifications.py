from datetime import datetime
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)


def _get_referral_email_config():
    try:
        from cbr_api.models import EmailSettings

        email_settings = EmailSettings.get_solo()
        return (
            email_settings.from_email or settings.DEFAULT_FROM_EMAIL,
            email_settings.from_email_password or settings.EMAIL_HOST_PASSWORD,
            email_settings.to_email or settings.REFERRAL_NOTIFICATION_TO_EMAIL,
        )
    except Exception:
        logger.exception("Failed to load email settings; falling back to defaults")
        return (
            settings.DEFAULT_FROM_EMAIL,
            settings.EMAIL_HOST_PASSWORD,
            settings.REFERRAL_NOTIFICATION_TO_EMAIL,
        )


def send_referral_created_email(referral):
    created_ms = referral.date_referred
    created_dt = datetime.fromtimestamp(
        created_ms / 1000, tz=timezone.get_current_timezone()
    )
    body = (
        f"Referral ID: {referral.id}\n"
        f"Created at: {created_ms} ({created_dt.isoformat()})"
    )

    from_email, from_password, to_email = _get_referral_email_config()
    if not to_email:
        logger.warning(
            "Referral notification email skipped; no recipient configured",
            extra={"referral_id": str(referral.id)},
        )
        return

    try:
        send_mail(
            settings.REFERRAL_NOTIFICATION_SUBJECT,
            body,
            from_email,
            [to_email],
            fail_silently=False,
            auth_user=from_email,
            auth_password=from_password,
        )
    except Exception:
        logger.exception(
            "Failed to send referral notification email",
            extra={"referral_id": str(referral.id)},
        )
