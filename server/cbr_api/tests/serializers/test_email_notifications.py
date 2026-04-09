import uuid
from base64 import b64decode
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from cbr_api.email_notifications import (
    send_bug_report_email,
    send_referral_created_email,
)
from cbr_api.models import Client, Referral, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class ReferralEmailNotificationTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.super_user = UserCBR.objects.create_user(
            username="root",
            password="root",
            zone=self.zone.id,
            first_name="Referrer",
            last_name="User",
        )
        self.client = create_client(
            user=self.super_user,
            first="John",
            last="Doe",
            contact="1234567890",
            zone=self.zone,
            gender=Client.Gender.MALE,
        )
        self.referral = Referral.objects.create(
            id=uuid.uuid4(),
            user_id=self.super_user,
            client_id=self.client,
            date_referred=1700000000000,
            outcome="",
            wheelchair=True,
            physiotherapy=True,
            mental_health=True,
            condition="Back pain",
            mental_health_condition="Anxiety",
            services_other="Transport assistance",
        )

    @override_settings(DOMAIN="cbr.example.org")
    @patch(
        "cbr_api.email_notifications.render_to_string", return_value="<html>ok</html>"
    )
    @patch("cbr_api.email_notifications.send_mail")
    @patch(
        "cbr_api.email_notifications._get_referral_email_config",
        return_value=("from@example.com", "secret-password", "to@example.com"),
    )
    def test_send_referral_created_email_sends_expected_email(
        self, _mock_cfg, mock_send_mail, mock_render
    ):
        send_referral_created_email(self.referral)

        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args

        self.assertIn("New CBR Referral Created", args[0])
        self.assertIn("John Doe", args[0])
        self.assertIn("Wheelchair", args[0])
        self.assertIn("Client name: John Doe", args[1])
        self.assertIn("Referral type(s): Wheelchair", args[1])
        self.assertIn("Client link: https://cbr.example.org/client/", args[1])
        self.assertIn("Created at:", args[1])
        self.assertEqual(args[2], "from@example.com")
        self.assertEqual(args[3], ["to@example.com"])

        self.assertEqual(kwargs["auth_user"], "from@example.com")
        self.assertEqual(kwargs["auth_password"], "secret-password")
        self.assertEqual(kwargs["html_message"], "<html>ok</html>")

        mock_render.assert_called_once()
        render_args, _render_kwargs = mock_render.call_args
        self.assertEqual(render_args[0], "cbr_api/referral_created_email.html")
        self.assertEqual(render_args[1]["client_name"], "John Doe")
        self.assertIn("Wheelchair", render_args[1]["services_label"])
        self.assertIn("Physiotherapy", render_args[1]["services_label"])
        self.assertEqual(
            render_args[1]["client_link"],
            f"https://cbr.example.org/client/{self.client.id}",
        )

    @patch("cbr_api.email_notifications.send_mail")
    @patch("cbr_api.email_notifications._get_referral_email_config", return_value=None)
    def test_send_referral_email_skips_when_settings_unavailable(
        self, _mock_cfg, mock_send_mail
    ):
        send_referral_created_email(self.referral)
        mock_send_mail.assert_not_called()

    @patch("cbr_api.email_notifications.send_mail")
    @patch(
        "cbr_api.email_notifications._get_referral_email_config",
        return_value=("from@example.com", "", "to@example.com"),
    )
    def test_send_referral_email_skips_when_settings_incomplete(
        self, _mock_cfg, mock_send_mail
    ):
        send_referral_created_email(self.referral)
        mock_send_mail.assert_not_called()


class BugReportEmailNotificationTests(TestCase):
    ONE_BY_ONE_PNG_BYTES = b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+Xg0AAAAASUVORK5CYII="
    )

    @patch(
        "cbr_api.email_notifications.render_to_string", return_value="<html>bug</html>"
    )
    @patch("cbr_api.email_notifications.EmailMultiAlternatives")
    @patch("cbr_api.email_notifications.get_connection", return_value="smtp-connection")
    @patch(
        "cbr_api.email_notifications._get_bug_report_email_config",
        return_value=("from@example.com", "secret-password", "to@example.com"),
    )
    def test_send_bug_report_email_sends_expected_email_without_attachment(
        self, _mock_cfg, mock_get_connection, mock_email_cls, mock_render
    ):
        mock_message = mock_email_cls.return_value
        mock_message.send.return_value = 1

        success, error = send_bug_report_email(
            report_type="bug_report",
            description="Cannot save referral details",
            submitted_by_name="Jane Doe",
            submitted_by_username="jdoe",
        )

        self.assertTrue(success)
        self.assertIsNone(error)

        mock_get_connection.assert_called_once_with(
            username="from@example.com",
            password="secret-password",
            fail_silently=False,
        )
        mock_email_cls.assert_called_once()
        _, kwargs = mock_email_cls.call_args

        self.assertIn("New CBR Bug Report", kwargs["subject"])
        self.assertIn("Jane Doe", kwargs["subject"])
        self.assertEqual(kwargs["from_email"], "from@example.com")
        self.assertEqual(kwargs["to"], ["to@example.com"])
        self.assertEqual(kwargs["connection"], "smtp-connection")
        self.assertIn("Type: Bug Report", kwargs["body"])
        self.assertIn("Submitted by: Jane Doe (jdoe)", kwargs["body"])
        self.assertIn("Cannot save referral details", kwargs["body"])

        mock_message.attach_alternative.assert_called_once_with(
            "<html>bug</html>", "text/html"
        )
        mock_message.attach.assert_not_called()
        mock_message.send.assert_called_once_with(fail_silently=False)

        mock_render.assert_called_once()
        render_args, _ = mock_render.call_args
        self.assertEqual(render_args[0], "cbr_api/bug_report_email.html")
        self.assertEqual(render_args[1]["report_type_label"], "Bug Report")
        self.assertEqual(render_args[1]["submitter"], "Jane Doe (jdoe)")
        self.assertFalse(render_args[1]["show_screenshot_preview"])

    @patch(
        "cbr_api.email_notifications.render_to_string",
        return_value="<html>suggest</html>",
    )
    @patch("cbr_api.email_notifications.EmailMultiAlternatives")
    @patch("cbr_api.email_notifications.get_connection", return_value="smtp-connection")
    @patch(
        "cbr_api.email_notifications._get_bug_report_email_config",
        return_value=("from@example.com", "secret-password", "to@example.com"),
    )
    def test_send_bug_report_email_attaches_screenshot_for_suggestion(
        self, _mock_cfg, _mock_get_connection, mock_email_cls, mock_render
    ):
        mock_message = mock_email_cls.return_value
        screenshot = SimpleUploadedFile(
            "screenshot.png",
            self.ONE_BY_ONE_PNG_BYTES,
            content_type="image/png",
        )

        success, error = send_bug_report_email(
            report_type="suggestion",
            description="Please add sorting to the table.",
            submitted_by_name="",
            submitted_by_username="jdoe",
            screenshot=screenshot,
        )

        self.assertTrue(success)
        self.assertIsNone(error)

        _, kwargs = mock_email_cls.call_args
        self.assertIn("New CBR Suggestion", kwargs["subject"])
        self.assertIn("jdoe", kwargs["subject"])
        self.assertIn("Type: Suggestion", kwargs["body"])
        self.assertIn("Submitted by: jdoe", kwargs["body"])

        self.assertEqual(mock_message.attach.call_count, 2)
        file_attach_args = mock_message.attach.call_args_list[0][0]
        self.assertEqual(file_attach_args[0], "screenshot.png")
        self.assertEqual(file_attach_args[1], self.ONE_BY_ONE_PNG_BYTES)
        self.assertEqual(file_attach_args[2], "image/png")

        inline_image = mock_message.attach.call_args_list[1][0][0]
        self.assertEqual(inline_image["Content-ID"], "<bug-report-screenshot>")
        self.assertIn("inline", inline_image["Content-Disposition"])

        render_args, _ = mock_render.call_args
        self.assertEqual(render_args[1]["report_type_label"], "Suggestion")
        self.assertTrue(render_args[1]["show_screenshot_preview"])

    @patch("cbr_api.email_notifications.EmailMultiAlternatives")
    @patch(
        "cbr_api.email_notifications._get_bug_report_email_config", return_value=None
    )
    def test_send_bug_report_email_returns_error_when_settings_unavailable(
        self, _mock_cfg, mock_email_cls
    ):
        success, error = send_bug_report_email(
            report_type="bug_report",
            description="Details",
            submitted_by_name="Jane",
            submitted_by_username="jdoe",
        )

        self.assertFalse(success)
        self.assertEqual(error, "Unable to load bug report email settings.")
        mock_email_cls.assert_not_called()

    @patch("cbr_api.email_notifications.EmailMultiAlternatives")
    @patch(
        "cbr_api.email_notifications._get_bug_report_email_config",
        return_value=("from@example.com", "", "to@example.com"),
    )
    def test_send_bug_report_email_returns_error_when_settings_incomplete(
        self, _mock_cfg, mock_email_cls
    ):
        success, error = send_bug_report_email(
            report_type="bug_report",
            description="Details",
            submitted_by_name="Jane",
            submitted_by_username="jdoe",
        )

        self.assertFalse(success)
        self.assertEqual(error, "Bug report email settings are incomplete.")
        mock_email_cls.assert_not_called()

    @patch("cbr_api.email_notifications.EmailMultiAlternatives")
    @patch("cbr_api.email_notifications.get_connection", return_value="smtp-connection")
    @patch(
        "cbr_api.email_notifications._get_bug_report_email_config",
        return_value=("from@example.com", "secret-password", "to@example.com"),
    )
    def test_send_bug_report_email_returns_error_when_send_fails(
        self, _mock_cfg, _mock_get_connection, mock_email_cls
    ):
        mock_email_cls.return_value.send.side_effect = RuntimeError("smtp failed")

        success, error = send_bug_report_email(
            report_type="bug_report",
            description="Details",
            submitted_by_name="Jane",
            submitted_by_username="jdoe",
        )

        self.assertFalse(success)
        self.assertEqual(error, "Failed to send bug report email.")
