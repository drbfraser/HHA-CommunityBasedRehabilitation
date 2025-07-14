from django.test import TestCase
from cbr_api.models import Client, Disability, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class DisabilityModelTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.super_user = UserCBR.objects.create(
            username="root",
            password="root",
            is_superuser=True,
            zone=self.zone,
        )
        self.jane = create_client(
            user=self.super_user,
            first="Jane",
            last="Smith",
            gender=Client.Gender.FEMALE,
            contact="604-555-7676",
            zone=self.zone,
        )
        self.john = create_client(
            user=self.super_user,
            first="John",
            last="Smith",
            gender=Client.Gender.MALE,
            contact="604-555-4242",
            zone=self.zone,
        )

    def test_adding_and_retrieving_disability(self):
        amputee = Disability.objects.create(disability_type="Amputee")
        self.jane.disability.add(amputee)
        self.assertIn(amputee, self.jane.disability.all())
        # make sure john does not have the disability
        self.assertNotIn(amputee, self.john.disability.all())
        self.assertNotEqual(self.john.disability.count(), self.jane.disability.count())
        self.assertEqual(self.jane.disability.count(), 1)
