from base64 import b64decode
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from cbr_api.models import UserCBR, Zone


class BugReportEmailViewTests(APITestCase):
    ONE_BY_ONE_PNG_BYTES = b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+Xg0AAAAASUVORK5CYII="
    )

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="bugreportuser",
            password="bugreportpass123",
            first_name="Jane",
            last_name="Doe",
            zone=self.zone.id,
        )
        self.api_client = APIClient()
        self.api_client.force_authenticate(user=self.user)
        self.url = reverse("bug-report-email")

    @patch("cbr_api.views.send_bug_report_email", return_value=(True, None))
    def test_submit_bug_report_success(self, mock_send_bug_report_email):
        payload = {
            "report_type": "bug_report",
            "description": "   Unable to open alerts page   ",
        }
        response = self.api_client.post(self.url, payload, format="multipart")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["details"], "Bug report email sent successfully.")
        mock_send_bug_report_email.assert_called_once()

        kwargs = mock_send_bug_report_email.call_args.kwargs
        self.assertEqual(kwargs["report_type"], "bug_report")
        self.assertEqual(kwargs["description"], "Unable to open alerts page")
        self.assertEqual(kwargs["submitted_by_name"], "Jane Doe")
        self.assertEqual(kwargs["submitted_by_username"], "bugreportuser")
        self.assertIsNone(kwargs["screenshot"])

    @patch("cbr_api.views.send_bug_report_email", return_value=(True, None))
    def test_submit_suggestion_with_image(self, mock_send_bug_report_email):
        screenshot = SimpleUploadedFile(
            "suggestion.png",
            self.ONE_BY_ONE_PNG_BYTES,
            content_type="image/png",
        )
        payload = {
            "report_type": "suggestion",
            "description": "Please add sorting in the table.",
            "image": screenshot,
        }
        response = self.api_client.post(self.url, payload, format="multipart")

        self.assertEqual(response.status_code, 201)
        mock_send_bug_report_email.assert_called_once()

        kwargs = mock_send_bug_report_email.call_args.kwargs
        self.assertEqual(kwargs["report_type"], "suggestion")
        self.assertEqual(kwargs["description"], "Please add sorting in the table.")
        self.assertEqual(kwargs["submitted_by_name"], "Jane Doe")
        self.assertEqual(kwargs["submitted_by_username"], "bugreportuser")
        self.assertIsNotNone(kwargs["screenshot"])
        self.assertEqual(kwargs["screenshot"].name, "suggestion.png")

    @patch(
        "cbr_api.views.send_bug_report_email",
        return_value=(False, "Bug report email settings are incomplete."),
    )
    def test_submit_bug_report_returns_backend_error_details(
        self, _mock_send_bug_report_email
    ):
        payload = {
            "report_type": "bug_report",
            "description": "Cannot submit client form.",
        }
        response = self.api_client.post(self.url, payload, format="multipart")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["details"], "Bug report email settings are incomplete."
        )

    @patch("cbr_api.views.send_bug_report_email", return_value=(False, None))
    def test_submit_bug_report_returns_default_error_message(
        self, _mock_send_bug_report_email
    ):
        payload = {
            "report_type": "bug_report",
            "description": "Cannot submit client form.",
        }
        response = self.api_client.post(self.url, payload, format="multipart")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["details"], "Failed to send bug report email.")

    @patch("cbr_api.views.send_bug_report_email")
    def test_submit_bug_report_invalid_payload(self, mock_send_bug_report_email):
        payload = {
            "report_type": "bug_report",
        }
        response = self.api_client.post(self.url, payload, format="multipart")

        self.assertEqual(response.status_code, 400)
        self.assertIn("description", response.data)
        mock_send_bug_report_email.assert_not_called()

    @patch("cbr_api.views.send_bug_report_email")
    def test_submit_bug_report_unauthenticated(self, mock_send_bug_report_email):
        self.api_client.force_authenticate(user=None)
        payload = {
            "report_type": "bug_report",
            "description": "Something is broken.",
        }
        response = self.api_client.post(self.url, payload, format="multipart")

        self.assertEqual(response.status_code, 401)
        mock_send_bug_report_email.assert_not_called()
