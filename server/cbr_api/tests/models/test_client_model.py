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
