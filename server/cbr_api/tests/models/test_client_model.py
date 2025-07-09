from django.test import TestCase
from cbr_api.models import Client, Disability, UserCBR, Zone
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
            self.super_user,
            "John",
            "Doe",
            Client.Gender.MALE,
            "604-555-1234",
            self.zone,
        )
        self.assertIsNotNone(new_client.id)
        self.assertEqual(new_client.first_name, "John")
        self.assertEqual(new_client.last_name, "Doe")
        self.assertEqual(new_client.gender, Client.Gender.MALE)
        self.assertEqual(new_client.phone_number, "604-555-1234")
        self.assertEqual(new_client.zone, self.zone)
        self.assertTrue(new_client.is_active)
        self.assertEqual(new_client.hcr_type, Client.HCRType.NOT_SET)
