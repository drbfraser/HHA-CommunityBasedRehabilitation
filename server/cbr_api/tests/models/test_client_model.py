import tempfile
from unittest.mock import patch
from django.test import TestCase, override_settings
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from cbr_api.models import Client, Disability, RiskLevel, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class ClientModelTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.super_user = UserCBR.objects.create(
            username="root",
            password="root",
            is_superuser=True,
            zone=self.zone,
        )
        self.disability = Disability.objects.create(disability_type="Amputee")

    def test_client_creation_with_required_fields(self):
        new_client = create_client(
            user=self.super_user,
            first="John",
            last="Doe",
            gender=Client.Gender.MALE,
            contact="604-555-1234",
            zone=self.zone,
        )
        self.assertIsNotNone(new_client.id)
        self.assertEqual(new_client.user_id, self.super_user)
        self.assertEqual(new_client.first_name, "John")
        self.assertEqual(new_client.last_name, "Doe")
        self.assertEqual(new_client.gender, Client.Gender.MALE)
        self.assertEqual(new_client.phone_number, "604-555-1234")
        self.assertEqual(new_client.zone, self.zone)
        self.assertTrue(new_client.is_active)
        self.assertEqual(new_client.hcr_type, Client.HCRType.NOT_SET)
        self.assertEqual(new_client.created_at, 0)

    def test_client_gender_choices(self):
        male_client = create_client(
            user=self.super_user,
            first="John",
            last="Doe",
            gender=Client.Gender.MALE,
            contact="604-555-1234",
            zone=self.zone,
        )
        female_client = create_client(
            user=self.super_user,
            first="Jane",
            last="Doe",
            gender=Client.Gender.FEMALE,
            contact="604-555-5678",
            zone=self.zone,
        )

        self.assertEqual(male_client.gender, Client.Gender.MALE)
        self.assertNotEqual(male_client.gender, Client.Gender.FEMALE)
        self.assertEqual(female_client.gender, Client.Gender.FEMALE)
        self.assertNotEqual(female_client.gender, Client.Gender.MALE)

    def test_hcr_type_choices(self):
        host_community_client = create_client(
            user=self.super_user,
            first="Alice",
            last="Smith",
            gender=Client.Gender.FEMALE,
            contact="604-555-7890",
            zone=self.zone,
            hcr_type=Client.HCRType.HOST_COMMUNITY,
        )
        refugee_client = create_client(
            user=self.super_user,
            first="Bob",
            last="Smith",
            gender=Client.Gender.MALE,
            contact="604-555-1011",
            zone=self.zone,
            hcr_type=Client.HCRType.REFUGEE,
        )

        self.assertEqual(host_community_client.hcr_type, Client.HCRType.HOST_COMMUNITY)
        self.assertNotEqual(host_community_client.hcr_type, Client.HCRType.REFUGEE)
        self.assertEqual(refugee_client.hcr_type, Client.HCRType.REFUGEE)
        self.assertNotEqual(refugee_client.hcr_type, Client.HCRType.HOST_COMMUNITY)

    def test_client_optional_fields(self):
        client = create_client(
            user=self.super_user,
            first="Charlie",
            last="Brown",
            full_name="Charlie Brown",
            gender=Client.Gender.MALE,
            contact="604-555-1212",
            zone=self.zone,
            other_disability="Visual Impairment",
            caregiver_present=True,
            caregiver_name="Jane Doe",
            caregiver_phone="604-555-5678",
            caregiver_email="jane@example.com",
        )

        self.assertEqual(client.full_name, "Charlie Brown")
        self.assertEqual(client.other_disability, "Visual Impairment")
        self.assertTrue(client.caregiver_present)
        self.assertEqual(client.caregiver_name, "Jane Doe")
        self.assertEqual(client.caregiver_phone, "604-555-5678")
        self.assertEqual(client.caregiver_email, "jane@example.com")

    def test_client_many_to_many_disability_relationship(self):
        client = create_client(
            user=self.super_user,
            first="David",
            last="Johnson",
            gender=Client.Gender.MALE,
            contact="604-555-1313",
            zone=self.zone,
        )
        physical_disability = Disability.objects.create(disability_type="Physical")
        client.disability.add(self.disability, physical_disability)

        self.assertEqual(client.disability.count(), 2)
        self.assertIn(self.disability, client.disability.all())
        self.assertIn(physical_disability, client.disability.all())

    def test_client_risk_level_fields(self):
        client = create_client(
            user=self.super_user,
            first="Eve",
            last="Adams",
            gender=Client.Gender.FEMALE,
            contact="604-555-1414",
            zone=self.zone,
            health_risk_level=RiskLevel.HIGH,
            social_risk_level=RiskLevel.MEDIUM,
            nutrit_risk_level=RiskLevel.LOW,
            mental_risk_level=RiskLevel.HIGH,
            educat_risk_level=RiskLevel.MEDIUM,
        )

        self.assertEqual(client.health_risk_level, RiskLevel.HIGH)
        self.assertEqual(client.social_risk_level, RiskLevel.MEDIUM)
        self.assertEqual(client.nutrit_risk_level, RiskLevel.LOW)
        self.assertEqual(client.mental_risk_level, RiskLevel.HIGH)
        self.assertEqual(client.educat_risk_level, RiskLevel.MEDIUM)
        self.assertEqual(client.health_timestamp, 0)
        self.assertEqual(client.social_timestamp, 0)
        self.assertEqual(client.educat_timestamp, 0)
        self.assertEqual(client.nutrit_timestamp, 0)
        self.assertEqual(client.mental_timestamp, 0)
        self.assertEqual(client.last_visit_date, 0)

    def test_client_str_field_max_lengths(self):
        long_name = "A" * 51  # Max length for first_name and last_name is 50
        long_full_name = "B" * 102  # Max length for full_name is 101
        long_phone = "C" * 51  # Max length for phone_number is 50
        long_village = "D" * 51  # Max length for village is 50
        long_disability = "E" * 101  # Max length for other_disability is 100

        client = Client(
            user_id=self.super_user,
            first_name=long_name,
            last_name=long_name,
            full_name=long_full_name,
            other_disability=long_disability,
            gender=Client.Gender.MALE,
            phone_number=long_phone,
            zone=self.zone,
            village=long_village,
            created_at=0,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
        )

        # Client creates the client instance but does not save it, so we need to call full_clean to validate
        with self.assertRaises(ValidationError):
            client.full_clean()  # This should raise a validation error due to max length constraints

    @patch("os.path.splitext")
    @patch("cbr_api.models.get_random_string")
    def test_rename_file_method_with_primary_key(
        self, mock_get_random_string, mock_splitext
    ):
        client = create_client(
            id="FILE001",
            user=self.super_user,
            first="Frank",
            last="Castle",
            gender=Client.Gender.MALE,
            contact="604-555-1515",
            zone=self.zone,
        )

        mock_splitext.return_value = ("original", ".jpg")
        result = client.rename_file("original.jpg")
        expected_file_name = "client-FILE001.jpg"

        self.assertTrue(result.endswith(expected_file_name))
        # random string only called if client has not primary key
        mock_get_random_string.assert_not_called()
        mock_splitext.assert_called_once_with("original.jpg")

    @patch("os.path.splitext")
    @patch("cbr_api.models.get_random_string")
    def test_rename_file_without_primary_key(self, mock_random_string, mock_splitext):
        mock_splitext.return_value = ("original", ".jpg")
        mock_random_string.return_value = "ABC123DEF4"

        client = client = Client(
            user_id=self.super_user,
            first_name="John",
            last_name="Doe",
            gender=Client.Gender.MALE,
            phone_number="604-555-1234",
            zone=self.zone,
            created_at=0,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
        )

        result = client.rename_file("original.jpg")

        self.assertTrue(result.endswith("temp-ABC123DEF4-original.jpg"))
        mock_random_string.assert_called_once_with(10)

    def test_client_cascade_protection(self):
        client = create_client(
            user=self.super_user,
            first="Grace",
            last="Hopper",
            gender=Client.Gender.FEMALE,
            contact="604-555-1616",
            zone=self.zone,
        )

        with self.assertRaises(Exception):
            self.super_user.delete()  # Should raise an error due to foreign key constraint

        with self.assertRaises(Exception):
            self.zone.delete()  # Should raise an error due to foreign key constraint

    @override_settings(MEDIA_ROOT=tempfile.gettempdir())
    def test_client_picture_upload(self):
        test_image = SimpleUploadedFile(
            name="test_image.jpg",
            content=b"fake image content",
            content_type="image/jpeg",
        )
        client = create_client(
            user=self.super_user,
            first="Hank",
            last="Pym",
            gender=Client.Gender.MALE,
            contact="604-555-1717",
            zone=self.zone,
            picture=test_image,
        )

        self.assertIsNotNone(client.picture)
        self.assertTrue(client.picture.name)
        self.assertTrue(client.picture.name.endswith(f"client-{client.id}.jpg"))

    def test_client_active_status_toggle(self):
        client = create_client(
            user=self.super_user,
            first="Ivy",
            last="League",
            gender=Client.Gender.FEMALE,
            contact="604-555-1818",
            zone=self.zone,
        )

        self.assertTrue(client.is_active)
        client.is_active = False
        client.save()
        client.refresh_from_db()
        self.assertFalse(client.is_active)
