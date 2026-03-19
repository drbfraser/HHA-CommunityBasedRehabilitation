from unittest.mock import patch

from django.test import TestCase

from cbr_api.models import EmailSettings


class EmailSettingsModelTests(TestCase):
    def test_get_solo_creates_default_record_when_none_exists(self):
        EmailSettings.objects.filter(category=EmailSettings.Category.REFERRAL).delete()
        self.assertEqual(
            EmailSettings.objects.filter(
                category=EmailSettings.Category.REFERRAL
            ).count(),
            0,
        )

        email_settings = EmailSettings.get_solo(EmailSettings.Category.REFERRAL)

        self.assertEqual(
            EmailSettings.objects.filter(
                category=EmailSettings.Category.REFERRAL
            ).count(),
            1,
        )
        self.assertEqual(email_settings.category, EmailSettings.Category.REFERRAL)
        self.assertEqual(email_settings.from_email, "")
        self.assertEqual(email_settings.from_email_password, "")
        self.assertEqual(email_settings.to_email, "")
        self.assertEqual(email_settings.password_updated_at, 0)

    def test_get_solo_returns_existing_record(self):
        EmailSettings.objects.filter(category=EmailSettings.Category.REFERRAL).delete()
        existing = EmailSettings.objects.create(
            category=EmailSettings.Category.REFERRAL,
            from_email="from@example.com",
            from_email_password="secret",
            to_email="to@example.com",
        )

        fetched = EmailSettings.get_solo(EmailSettings.Category.REFERRAL)

        self.assertEqual(fetched.id, existing.id)
        self.assertEqual(
            EmailSettings.objects.filter(
                category=EmailSettings.Category.REFERRAL
            ).count(),
            1,
        )

    def test_get_solo_returns_per_category_record(self):
        referral_settings = EmailSettings.get_solo(EmailSettings.Category.REFERRAL)
        bug_settings = EmailSettings.get_solo(EmailSettings.Category.BUG_REPORT)

        self.assertNotEqual(referral_settings.id, bug_settings.id)
        self.assertEqual(referral_settings.category, EmailSettings.Category.REFERRAL)
        self.assertEqual(bug_settings.category, EmailSettings.Category.BUG_REPORT)
        self.assertEqual(
            EmailSettings.objects.filter(
                category=EmailSettings.Category.REFERRAL
            ).count(),
            1,
        )
        self.assertEqual(
            EmailSettings.objects.filter(
                category=EmailSettings.Category.BUG_REPORT
            ).count(),
            1,
        )

    @patch("cbr_api.models.current_milli_time", return_value=1700000000000)
    def test_save_updates_updated_at(self, _mock_now):
        email_settings = EmailSettings.objects.create(
            category=EmailSettings.Category.REFERRAL,
            from_email="from@example.com",
            from_email_password="secret",
            to_email="to@example.com",
        )
        email_settings.updated_at = 1
        email_settings.save()
        email_settings.refresh_from_db()

        self.assertEqual(email_settings.updated_at, 1700000000000)
