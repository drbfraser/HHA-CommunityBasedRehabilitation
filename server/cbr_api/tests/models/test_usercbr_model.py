from django.test import TestCase
from cbr_api.models import UserCBR, Zone
from cbr_api.tests.helpers import create_client


class UserCBRModelTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.super_user = UserCBR.objects.create(
            username="root",
            password="root",
            is_superuser=True,
            zone=self.zone,
        )

    def test_super_user_creation(self):

        self.assertTrue(self.super_user.is_superuser)
        self.assertEqual(self.super_user.zone, self.zone)

    def test_phone_number_fields_and_defaults(self):
        jane = create_client(
            self.super_user, "Jane", "Smith", "F", "604-555-7676", self.zone
        )
        john = create_client(
            self.super_user, "John", "Smith", "M", "604-555-4242", self.zone
        )

        self.assertEqual(jane.phone_number, "604-555-7676")
        self.assertEqual(john.phone_number, "604-555-4242")

        self.assertEqual(jane.last_name, john.last_name)
        self.assertEqual(jane.user_id, john.user_id)
        self.assertEqual(jane.zone, john.zone)
