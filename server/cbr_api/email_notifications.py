from datetime import datetime
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.html import escape

logger = logging.getLogger(__name__)

EMAIL_SUBJECT = "New CBR Referral Created"
DEFAULT_WEB_BASE_URL = "http://localhost:3000"
PRIMARY_COLOR = "#009dc5"
ACCENT_COLOR = "#56af31"
SECONDARY_COLOR = "#863b8f"


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
        body_lines.append(f"Client name: {client_name}")
    if services_label:
        body_lines.append(f"Referral type(s): {services_label}")
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
    escaped_client_name = escape(client_name)
    escaped_services = escape(services_label)
    escaped_referred_by = escape(referred_by)
    escaped_created = escape(created_pretty)
    escaped_link = escape(client_link)
    detail_items = "\n".join([f"<li>{escape(item)}</li>" for item in details])
    button_html = ""
    if client_link:
        button_html = f"""
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 20px auto 0;">
                <tr>
                    <td bgcolor="{SECONDARY_COLOR}" style="border-radius: 8px; text-align: center;">
                        <a href="{escaped_link}" style="display: inline-block; padding: 12px 20px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                            View Client Details
                        </a>
                    </td>
                </tr>
            </table>
        """

    details_block = ""
    if details:
        details_block = f"""
            <tr>
                <td style="padding: 0 24px 12px;">
                    <p style="margin: 0 0 8px; color: #2a3340; font-size: 14px; font-weight: 600;">Details</p>
                    <ul style="margin: 0; padding-left: 18px; color: #2a3340; font-size: 14px; line-height: 1.5;">
                        {detail_items}
                    </ul>
                </td>
            </tr>
        """

    html_body = f"""
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>New Referral</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7fb;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f7fb;">
            <tr>
                <td align="center" style="padding: 24px 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e6edf3; font-family: Arial, Helvetica, sans-serif;">
                        <tr>
                            <td style="background: linear-gradient(90deg, {PRIMARY_COLOR}, {ACCENT_COLOR}); padding: 18px 24px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="vertical-align: middle; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.3px;">
                                            Hope Health Action
                                        </td>
                                        <td align="right" style="vertical-align: middle; color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.2px;">
                                            New Referral
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 24px 24px 12px;">
                                <p style="margin: 0 0 12px; color: #2a3340; font-size: 16px;">
                                    A new referral has been created.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 24px 16px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fbfd; border: 1px solid #e6edf3; border-radius: 10px;">
                                    <tr>
                                        <td style="padding: 14px 16px; color: #2a3340; font-size: 14px; line-height: 1.6;">
                                            <div style="margin-bottom: 8px;">
                                                <span style="color: #6b7280;">Client name:</span>
                                                <strong style="color: #111827;">{escaped_client_name}</strong>
                                            </div>
                                            <div style="margin-bottom: 8px;">
                                                <span style="color: #6b7280;">Referral type(s):</span>
                                                <strong style="color: #111827;">{escaped_services}</strong>
                                            </div>
                                            {f'<div style="margin-bottom: 0;"><span style="color: #6b7280;">Referred by:</span> {escaped_referred_by}</div>' if referred_by else ''}
                                        </td>
                                    </tr>
                                </table>
                                {button_html}
                            </td>
                        </tr>
                        {details_block}
                        <tr>
                            <td style="padding: 8px 24px 24px; color: #6b7280; font-size: 12px;">
                                Created at: {escaped_created}
                            </td>
                        </tr>
                    </table>
                    <div style="padding: 12px 0 0; color: #9aa4b2; font-size: 11px; font-family: Arial, Helvetica, sans-serif;">
                        Hope Health Action
                    </div>
                </td>
            </tr>
        </table>
    </body>
</html>
    """.strip()

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
