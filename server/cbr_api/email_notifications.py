from datetime import datetime
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.html import escape

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

    referred_by = ""
    referrer = getattr(referral, "user_id", None)
    if referrer:
        referrer_first = getattr(referrer, "first_name", "")
        referrer_last = getattr(referrer, "last_name", "")
        referrer_username = getattr(referrer, "username", "")
        referred_by = f"{referrer_first} {referrer_last}".strip()
        if referrer_username:
            referred_by = (
                f"{referred_by} ({referrer_username})"
                if referred_by
                else referrer_username
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

    domain = getattr(settings, "DOMAIN", "")
    base_url = (f"https://{domain}" if domain else DEFAULT_WEB_BASE_URL).rstrip("/")
    client_link = _build_client_link(client_id, base_url) if client_id else ""

    services_label = ", ".join(services)
    subject_parts = []
    if client_name:
        subject_parts.append(client_name)
    if services_label:
        subject_parts.append(services_label)
    subject = EMAIL_SUBJECT
    if subject_parts:
        subject = f"{EMAIL_SUBJECT} - {' - '.join(subject_parts)}"

    body_lines = ["A new referral has been created.", ""]
    if client_name:
        body_lines.append(f"Client name: **{client_name}**")
    if services_label:
        body_lines.append(f"Referral type(s): **{services_label}**")
    if referred_by:
        body_lines.append(f"Referred by: {referred_by}")
    if details:
        body_lines.append("")
        body_lines.append("Details:")
        body_lines.extend([f"- {item}" for item in details])
    if client_link:
        body_lines.append("")
        body_lines.append(f"Client link: {client_link}")
    body_lines.append("")
    body_lines.append(f"Created at: {created_pretty}")

    body = "\n".join(body_lines)
    html_lines = ["<p>A new referral has been created.</p>"]
    if client_name:
        html_lines.append(
            f"<p>Client name: <strong>{escape(client_name)}</strong></p>"
        )
    if services_label:
        html_lines.append(
            f"<p>Referral type(s): <strong>{escape(services_label)}</strong></p>"
        )
    if referred_by:
        html_lines.append(f"<p>Referred by: {escape(referred_by)}</p>")
    if details:
        html_lines.append("<p>Details:</p>")
        html_lines.append("<ul>")
        html_lines.extend([f"<li>{escape(item)}</li>" for item in details])
        html_lines.append("</ul>")
    if client_link:
        escaped_link = escape(client_link)
        html_lines.append(
            f'<p>Client link: <a href="{escaped_link}">{escaped_link}</a></p>'
        )
    html_lines.append(f"<p>Created at: {escape(created_pretty)}</p>")
    html_body = "\n".join(html_lines)

    try:
        send_mail(
            subject,
            body,
            from_email,
            [to_email],
            fail_silently=False,
            auth_user=from_email,
            auth_password=from_password,
            html_message=html_body,
        )
    except Exception:
        logger.exception(
            "Failed to send referral notification email",
            extra={"referral_id": str(referral.id)},
        )
