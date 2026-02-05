from datetime import datetime
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)

EMAIL_SUBJECT = "New CBR Referral Created"
DEFAULT_WEB_BASE_URL = "http://localhost:3000"


def _build_client_link(client_id, base_url):
    return f"{base_url}/client/{client_id}"


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
    client = getattr(referral, "client_id", None)
    client_name = ""
    client_id = ""
    if client:
        client_id = str(getattr(client, "id", ""))
        first_name = getattr(client, "first_name", "")
        last_name = getattr(client, "last_name", "")
        client_name = f"{first_name} {last_name}".strip()

    created_ms = referral.date_referred
    created_dt = datetime.fromtimestamp(
        created_ms / 1000, tz=timezone.get_current_timezone()
    )
    created_pretty = created_dt.strftime("%B %d, %Y %I:%M %p %Z")
    services = []
    if referral.wheelchair:
        services.append("Wheelchair")
    if referral.prosthetic:
        services.append("Prosthetic")
    if referral.orthotic:
        services.append("Orthotic")
    if referral.physiotherapy:
        services.append("Physiotherapy")
    if referral.mental_health:
        services.append("Mental Health")
    if referral.hha_nutrition_and_agriculture_project:
        services.append("HHA Nutrition/Agriculture Project")
    if referral.emergency_food_aid:
        services.append("Emergency Food Aid")
    if referral.agriculture_livelihood_program_enrollment:
        services.append("Agriculture/Livelihood Program Enrollment")
    if referral.services_other:
        services.append("Other Services")

    details = []
    if referral.condition:
        details.append(f"Condition: {referral.condition}")
    if referral.mental_health_condition:
        details.append(f"Mental health condition: {referral.mental_health_condition}")
    if referral.prosthetic_injury_location:
        details.append(
            f"Prosthetic injury location: {referral.prosthetic_injury_location}"
        )
    if referral.orthotic_injury_location:
        details.append(f"Orthotic injury location: {referral.orthotic_injury_location}")
    if referral.hip_width:
        details.append(f"Hip width: {referral.hip_width}")
    if referral.services_other:
        details.append(f"Other services: {referral.services_other}")

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

    domain = getattr(settings, "DOMAIN", "")
    base_url = (f"https://{domain}" if domain else DEFAULT_WEB_BASE_URL).rstrip("/")
    client_link = _build_client_link(client_id, base_url) if client_id else ""

    body_lines = [
        "A new referral has been created.",
        "",
        f"Created at: {created_pretty}",
    ]
    if client_name:
        body_lines.append(f"Client name: {client_name}")
    if services:
        body_lines.append(f"Referral type(s): {', '.join(services)}")
    if client_link:
        body_lines.append("")
        body_lines.append(f"Client link: {client_link}")
    if details:
        body_lines.append("")
        body_lines.append("Details:")
        body_lines.extend([f"- {item}" for item in details])

    body = "\n".join(body_lines)

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
