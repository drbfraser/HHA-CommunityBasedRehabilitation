import uuid
from unittest.mock import patch

from django.test import TestCase, override_settings

from cbr_api.email_notifications import send_referral_created_email
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
    @patch("cbr_api.email_notifications.render_to_string", return_value="<html>ok</html>")
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
            render_args[1]["client_link"], f"https://cbr.example.org/client/{self.client.id}"
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
