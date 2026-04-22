from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from cbr_api.models import EmailSettings, UserCBR, Zone


class EmailSettingsViewTests(APITestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.admin = UserCBR.objects.create_user(
            username="admin",
            password="adminpass123",
            role=UserCBR.Role.ADMIN,
            zone=self.zone.id,
        )
        self.api_client = APIClient()
        self.api_client.force_authenticate(user=self.admin)
        self.url = reverse("email-settings")

    def test_get_bug_report_settings_by_category(self):
        EmailSettings.objects.filter(
            category=EmailSettings.Category.BUG_REPORT
        ).delete()
        EmailSettings.objects.create(
            category=EmailSettings.Category.BUG_REPORT,
            from_email="bugs@example.com",
            from_email_password="secret",
            to_email="support@example.com",
        )

        response = self.api_client.get(
            self.url, {"category": EmailSettings.Category.BUG_REPORT}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["category"], EmailSettings.Category.BUG_REPORT)
        self.assertEqual(response.data["from_email"], "bugs@example.com")
        self.assertEqual(response.data["to_email"], "support@example.com")
        self.assertTrue(response.data["from_email_password_set"])
        self.assertNotIn("from_email_password", response.data)

    def test_invalid_category_returns_validation_error(self):
        response = self.api_client.get(self.url, {"category": "alerts"})

        self.assertEqual(response.status_code, 400)
        self.assertIn("category", response.data)
