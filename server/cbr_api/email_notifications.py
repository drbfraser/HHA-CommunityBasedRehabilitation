from datetime import datetime
import smtplib
from email.mime.image import MIMEImage

from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection, send_mail
from django.template.loader import render_to_string
from django.utils import timezone


def describe_error_cause(exc):
    if isinstance(exc, smtplib.SMTPAuthenticationError):
        return (
            "Email sign-in failed: the sender email or app password is invalid or "
            "expired. Please update the app password in the admin email settings."
        )
    if isinstance(exc, (smtplib.SMTPSenderRefused, smtplib.SMTPRecipientsRefused)):
        return (
            "The email server rejected the sender or recipient address. Please "
            "verify the email settings."
        )
    if isinstance(exc, smtplib.SMTPException):
        return (
            "The email server rejected the request. Please verify the email "
            "settings and try again."
        )
    return "Failed to send the email. Please verify the email settings and try again."


EMAIL_SUBJECT = "New CBR Referral Created"
BUG_REPORT_SUBJECT = "New CBR Bug Report"
SUGGESTION_SUBJECT = "New CBR Suggestion"
DEFAULT_WEB_BASE_URL = "http://localhost:3000"
PRIMARY_COLOR = "#009dc5"
ACCENT_COLOR = "#56af31"
SECONDARY_COLOR = "#863b8f"


def _build_client_link(client_id, base_url):
    return f"{base_url}/client/{client_id}"


def _get_referral_email_config():
    try:
        from cbr_api.models import EmailSettings

        email_settings = EmailSettings.get_solo(EmailSettings.Category.REFERRAL)
        return (
            email_settings.from_email,
            email_settings.from_email_password,
            email_settings.to_email,
        )
    except Exception:
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
    if referral.safe_guarding:
        services.append("Safe Guarding")
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
    if referral.safe_guarding_observation:
        details.append(
            f"Safe Guarding observation: {referral.safe_guarding_observation}"
        )
    if referral.safe_guarding_person_involved:
        details.append(
            f"Safe Guarding person involved: {referral.safe_guarding_person_involved}"
        )
    if referral.safe_guarding_action_needed:
        details.append(
            f"Safe Guarding action needed: {referral.safe_guarding_action_needed}"
        )
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
    body_lines.append("")
    body_lines.append(
        "Please do not reply to this email; it was sent automatically and is not monitored."
    )

    body = "\n".join(body_lines)
    html_body = render_to_string(
        "cbr_api/referral_created_email.html",
        {
            "primary_color": PRIMARY_COLOR,
            "accent_color": ACCENT_COLOR,
            "secondary_color": SECONDARY_COLOR,
            "client_name": client_name,
            "services_label": services_label,
            "referred_by": referred_by,
            "details": details,
            "client_link": client_link,
            "created_pretty": created_pretty,
        },
    )

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
        pass


def _get_bug_report_email_config():
    try:
        from cbr_api.models import EmailSettings

        email_settings = EmailSettings.get_solo(EmailSettings.Category.BUG_REPORT)
        return (
            email_settings.from_email,
            email_settings.from_email_password,
            email_settings.to_email,
        )
    except Exception:
        return None


def send_bug_report_email(
    *,
    report_type,
    description,
    submitted_by_name,
    submitted_by_username,
    screenshot=None,
):
    config = _get_bug_report_email_config()
    if not config:
        return False, "Unable to load bug report email settings."

    from_email, from_password, to_email = config
    if not from_email or not to_email or not from_password:
        return False, "Bug report email settings are incomplete."

    report_type_label = "Suggestion" if report_type == "suggestion" else "Bug Report"

    submitter = submitted_by_name or submitted_by_username or "Unknown User"
    if submitted_by_name and submitted_by_username:
        submitter = f"{submitted_by_name} ({submitted_by_username})"

    subject = SUGGESTION_SUBJECT if report_type == "suggestion" else BUG_REPORT_SUBJECT
    subject_identity = submitted_by_name or submitted_by_username
    if subject_identity:
        subject = f"{subject} - {subject_identity}"

    body_lines = [
        f"Type: {report_type_label}",
        f"Submitted by: {submitter}",
        "",
        "Description:",
        description,
        "",
        "Please do not reply to this email; it was sent automatically and is not monitored.",
    ]
    body = "\n".join(body_lines)

    html_body = render_to_string(
        "cbr_api/bug_report_email.html",
        {
            "primary_color": PRIMARY_COLOR,
            "accent_color": ACCENT_COLOR,
            "secondary_color": SECONDARY_COLOR,
            "report_type_label": report_type_label,
            "submitter": submitter,
            "description": description,
            "show_screenshot_preview": bool(screenshot),
        },
    )

    try:
        connection = get_connection(
            username=from_email,
            password=from_password,
            fail_silently=False,
        )
        message = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=from_email,
            to=[to_email],
            connection=connection,
        )
        message.attach_alternative(html_body, "text/html")
        if screenshot:
            screenshot_bytes = screenshot.read()
            screenshot_name = screenshot.name or "bug-report-attachment"
            screenshot_content_type = (
                screenshot.content_type or "application/octet-stream"
            )

            # Keep a normal attachment so recipients can download/open the original file.
            message.attach(
                screenshot_name,
                screenshot_bytes,
                screenshot_content_type,
            )

            # Also embed the image inline in the HTML body.
            inline_image = MIMEImage(screenshot_bytes)
            inline_image.add_header("Content-ID", "<bug-report-screenshot>")
            inline_image.add_header(
                "Content-Disposition", "inline", filename=screenshot_name
            )
            message.attach(inline_image)
        message.send(fail_silently=False)
        return True, None
    except Exception as exc:
        return False, describe_error_cause(exc)


def verify_email_credentials(category):
    """Check whether the saved email credentials for a category can sign in.

    - ``ok``: credentials are complete and sign-in succeeded
    - ``not_configured``: one or more of from/to/password is missing
    - ``auth_error``: sign-in was rejected (app password likely invalid/expired)
    - ``error``: settings could not be loaded or another failure occurred
    """
    from cbr_api.models import EmailSettings

    try:
        email_settings = EmailSettings.get_solo(category)
    except Exception:
        return {
            "status": "error",
            "configured": False,
            "details": "Unable to load email settings.",
        }

    from_email = email_settings.from_email
    from_password = email_settings.from_email_password
    to_email = email_settings.to_email

    if not (from_email and from_password and to_email):
        return {
            "status": "not_configured",
            "configured": False,
            "details": "Email settings are not fully set up yet.",
        }

    connection = get_connection(
        username=from_email,
        password=from_password,
        fail_silently=False,
    )

    error_result = None
    try:
        connection.open()
    except Exception as exc:
        error_result = {
            "status": (
                "auth_error"
                if isinstance(exc, smtplib.SMTPAuthenticationError)
                else "error"
            ),
            "configured": True,
            "details": describe_error_cause(exc),
        }
    finally:
        try:
            connection.close()
        except Exception:
            pass

    if error_result is not None:
        return error_result

    return {
        "status": "ok",
        "configured": True,
        "details": "Email sign-in succeeded. The saved credentials are valid.",
    }
