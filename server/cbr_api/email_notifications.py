from datetime import datetime
import logging

from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)

EMAIL_SUBJECT = "New CBR Referral Created"


def _get_referral_email_config():
    try:
        from cbr_api.models import EmailSettings

        email_settings = EmailSettings.get_solo()
        return (
            email_settings.from_email,
            email_settings.from_email_password,
            email_settings.to_email,
        )
    except Exception:
        logger.exception("Failed to load email settings; referral email skipped")
        return None


def send_referral_created_email(referral):
    created_ms = referral.date_referred
    created_dt = datetime.fromtimestamp(
        created_ms / 1000, tz=timezone.get_current_timezone()
    )
    body = (
        f"Referral ID: {referral.id}\n"
        f"Created at: {created_ms} ({created_dt.isoformat()})"
    )

    config = _get_referral_email_config()
    if not config:
        return

    from_email, from_password, to_email = config
    if not from_email or not to_email or not from_password:
        logger.warning(
            "Referral notification email skipped; email settings incomplete",
            extra={"referral_id": str(referral.id)},
        )
        return

    try:
        send_mail(
            EMAIL_SUBJECT,
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
