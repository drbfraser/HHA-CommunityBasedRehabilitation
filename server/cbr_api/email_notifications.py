from datetime import datetime
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)


def send_referral_created_email(referral):
    created_ms = referral.date_referred
    created_dt = datetime.fromtimestamp(
        created_ms / 1000, tz=timezone.get_current_timezone()
    )
    body = (
        f"Referral ID: {referral.id}\n"
        f"Created at: {created_ms} ({created_dt.isoformat()})"
    )

    try:
        send_mail(
            settings.REFERRAL_NOTIFICATION_SUBJECT,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [settings.REFERRAL_NOTIFICATION_TO_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception(
            "Failed to send referral notification email",
            extra={"referral_id": str(referral.id)},
        )
