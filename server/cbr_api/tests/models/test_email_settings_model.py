from unittest.mock import patch

from django.test import TestCase

from cbr_api.models import EmailSettings


class EmailSettingsModelTests(TestCase):
    def test_get_solo_creates_default_record_when_none_exists(self):
        self.assertEqual(EmailSettings.objects.count(), 0)

        email_settings = EmailSettings.get_solo()

        self.assertEqual(EmailSettings.objects.count(), 1)
        self.assertEqual(email_settings.from_email, "")
        self.assertEqual(email_settings.from_email_password, "")
        self.assertEqual(email_settings.to_email, "")
        self.assertEqual(email_settings.password_updated_at, 0)

    def test_get_solo_returns_existing_record(self):
        existing = EmailSettings.objects.create(
            from_email="from@example.com",
            from_email_password="secret",
            to_email="to@example.com",
        )

        fetched = EmailSettings.get_solo()

        self.assertEqual(fetched.id, existing.id)
        self.assertEqual(EmailSettings.objects.count(), 1)

    @patch("cbr_api.models.current_milli_time", return_value=1700000000000)
    def test_save_updates_updated_at(self, _mock_now):
        email_settings = EmailSettings.objects.create(
            from_email="from@example.com",
            from_email_password="secret",
            to_email="to@example.com",
        )
        email_settings.updated_at = 1
        email_settings.save()
        email_settings.refresh_from_db()

        self.assertEqual(email_settings.updated_at, 1700000000000)
