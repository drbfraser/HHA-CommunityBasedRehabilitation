from unittest.mock import patch

from django.test import TestCase

from cbr_api.models import EmailSettings
from cbr_api.serializers import EmailSettingsSerializer


class EmailSettingsSerializerTests(TestCase):
    def setUp(self):
        self.email_settings = EmailSettings.objects.create(
            from_email="from@example.com",
            from_email_password="old-password",
            to_email="to@example.com",
            password_updated_at=1111111111111,
        )

    def test_from_email_password_set_flag(self):
        serializer = EmailSettingsSerializer(self.email_settings)
        self.assertTrue(serializer.data["from_email_password_set"])
        self.assertNotIn("from_email_password", serializer.data)

    def test_blank_password_does_not_overwrite_existing_password(self):
        serializer = EmailSettingsSerializer(
            self.email_settings,
            data={
                "from_email": "updated@example.com",
                "from_email_password": "  \n\t   ",
            },
            partial=True,
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()

        self.assertEqual(updated.from_email, "updated@example.com")
        self.assertEqual(updated.from_email_password, "old-password")
        self.assertEqual(updated.password_updated_at, 1111111111111)

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    def test_password_update_trims_whitespace_and_updates_timestamp(self, _mock_now):
        serializer = EmailSettingsSerializer(
            self.email_settings,
            data={
                "from_email_password": "  n e w \t p a s s  ",
            },
            partial=True,
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()

        self.assertEqual(updated.from_email_password, "newpass")
        self.assertEqual(updated.password_updated_at, 1700000000000)
