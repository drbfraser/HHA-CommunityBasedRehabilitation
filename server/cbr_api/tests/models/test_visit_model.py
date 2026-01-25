import tempfile
from decimal import Decimal
from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from cbr_api.models import Client, UserCBR, Visit, Zone
from cbr_api.tests.helpers import create_client, create_visit


class VisitModelTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="root",
            password="root",
            zone=self.zone.id,
        )
        self.client = create_client(
            user=self.user,
            first="John",
            last="Doe",
            contact="1234567890",
            zone=self.zone,
            gender=Client.Gender.MALE,
        )

    def test_visit_creation_with_required_fields(self):
        visit = create_visit(
            client=self.client,
            user=self.user,
            zone=self.zone,
            created_at=1234567890,
            village="Test Village",
        )

        self.assertIsNotNone(visit.id)
        self.assertEqual(visit.client_id, self.client)
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(visit.zone, self.zone)
        self.assertEqual(visit.village, "Test Village")
        self.assertEqual(visit.created_at, 1234567890)
        self.assertEqual(visit.server_created_at, 0)

        # for testing default values
        self.assertFalse(visit.health_visit)
        self.assertFalse(visit.educat_visit)
        self.assertFalse(visit.social_visit)
        self.assertFalse(visit.nutrit_visit)
        self.assertFalse(visit.mental_visit)

    def test_visit_optional_flags(self):
        visit = create_visit(
            client=self.client,
            user=self.user,
            zone=self.zone,
            created_at=1234567890,
            village="Test Village",
            health=True,
            educat=True,
            social=True,
            nutrit=True,
            mental=True,
        )

        self.assertTrue(visit.health_visit)
        self.assertTrue(visit.educat_visit)
        self.assertTrue(visit.social_visit)
        self.assertTrue(visit.nutrit_visit)
        self.assertTrue(visit.mental_visit)

    @patch("os.path.splitext")
    @patch("cbr_api.models.get_random_string")
    def test_rename_file_method_with_primary_key(self, mock_get_random_string, mock_splitext):
        visit = create_visit(
            client=self.client,
            user=self.user,
            zone=self.zone,
            created_at=1234567890,
            village="Test Village",
        )
        visit.id = "VISFILE001"

        mock_splitext.return_value = ("original", ".jpg")
        result = visit.rename_file("original.jpg")

        self.assertTrue(result.endswith("visit-VISFILE001.jpg"))
        mock_get_random_string.assert_not_called()
        mock_splitext.assert_called_once_with("original.jpg")

    @patch("os.path.splitext")
    @patch("cbr_api.models.get_random_string")
    def test_rename_file_without_primary_key(self, mock_random_string, mock_splitext):
        mock_splitext.return_value = ("original", ".jpg")
        mock_random_string.return_value = "ABC123DEF4"

        visit = Visit()
        result = visit.rename_file("original.jpg")

        self.assertTrue(result.endswith("ABC123DEF4-original.jpg"))
        mock_random_string.assert_called_once_with(10)

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    def test_visit_picture_upload(self):
        test_image = SimpleUploadedFile(
            name="test_image.jpg",
            content=b"fake image content",
            content_type="image/jpeg",
        )

        visit = Visit.objects.create(
            id="VISPIC001",
            client_id=self.client,
            user_id=self.user,
            created_at=1234567890,
            server_created_at=0,
            health_visit=True,
            educat_visit=False,
            social_visit=False,
            nutrit_visit=False,
            mental_visit=False,
            longitude=Decimal("0.0"),
            latitude=Decimal("0.0"),
            zone=self.zone,
            village="Test Village",
            picture=test_image,
        )

        self.assertIsNotNone(visit.picture)
        self.assertTrue(visit.picture.name)
        self.assertTrue(visit.picture.name.endswith(f"visit-{visit.id}.jpg"))

    def test_visit_foreign_key_behaviors(self):
        visit = create_visit(
            client=self.client,
            user=self.user,
            zone=self.zone,
            created_at=1234567890,
            village="Test Village",
        )

        # Zone/User are PROTECT, Client is CASCADE (on Visit)
        with self.assertRaises(Exception):
            self.user.delete()

        with self.assertRaises(Exception):
            self.zone.delete()

        # Deleting client should cascade delete visits
        client_id = self.client.id
        self.client.delete()
        self.assertEqual(Visit.objects.filter(client_id=client_id).count(), 0)

