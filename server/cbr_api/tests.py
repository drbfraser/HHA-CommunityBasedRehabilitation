from django.test import TestCase
from cbr_api import models
import uuid


class ModelsTestCase(TestCase):
    superuser = None

    def quickCreateSuperuser(self, Zone):
        return models.UserCBR.objects.create(
            username="root",
            password="root",
            is_superuser=True,
            zone=Zone,
        )

    def quickCreateClient(self, First, Last, Gender, Contact, Zone):
        return models.Client.objects.create(
            id=uuid.uuid4(),
            user_id=self.superuser,
            created_at=0,
            first_name=First,
            last_name=Last,
            phone_number=Contact,
            zone=Zone,
            gender=Gender,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
            village="",
        )

    def setUp(self):
        zone1 = models.Zone.objects.create(zone_name="Zone 1")
        self.superuser = self.quickCreateSuperuser(zone1)

        jane = self.quickCreateClient("Jane", "Smith", "F", "604-555-7676", zone1)
        john = self.quickCreateClient("John", "Smith", "M", "604-555-4242", zone1)

    def test(self):
        jane = models.Client.objects.get(first_name="Jane")
        john = models.Client.objects.get(first_name="John")

        self.assertEqual(jane.phone_number, "604-555-7676")
        self.assertEqual(john.phone_number, "604-555-4242")

        self.assertEqual(jane.last_name, john.last_name)
        self.assertEqual(jane.user_id, john.user_id)
        self.assertEqual(jane.zone, john.zone)

        amputee = models.Disability.objects.create(disability_type="Amputee")
        jane.disability.add(amputee)
        john.disability.add(amputee)

        self.assertEqual(len(jane.disability.all()), 1)
        self.assertEqual(len(john.disability.all()), 1)
