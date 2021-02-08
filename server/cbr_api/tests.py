from django.test import TestCase
from cbr_api import models
from django.contrib.auth.models import User


class ModelsTestCase(TestCase):
    numClients = 0
    superuser = None

    def quickCreateSuperuser(self):
        return User.objects.create(
            username="root",
            password="root",
            is_superuser=True,
        )

    def quickCreateClient(self, First, Last, Gender, Contact, Zone):
        self.numClients += 1
        return models.Client.objects.create(
            client_id=self.numClients,
            created_by_user_id=self.superuser,
            first_name=First,
            last_name=Last,
            phone_number=Contact,
            zone=Zone,
            gender=Gender,
            register_date=0,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
            village="",
        )

    def setUp(self):
        self.superuser = self.quickCreateSuperuser()

        zone1 = models.Zone.objects.create(zone_name="Zone 1")

        jane = self.quickCreateClient("Jane", "Smith", "F", "604-555-7676", zone1)
        john = self.quickCreateClient("John", "Smith", "M", "604-555-4242", zone1)

        amputee = models.Disability.objects.create(disability_type="Amputee")

        junction1 = models.DisabilityJunction.objects.create(
            disability=amputee, client=jane
        )
        junction2 = models.DisabilityJunction.objects.create(
            disability=amputee, client=john
        )

    def test(self):
        jane = models.Client.objects.get(first_name="Jane")
        john = models.Client.objects.get(first_name="John")

        jane_dis = models.DisabilityJunction.objects.get(client=jane)
        john_dis = models.DisabilityJunction.objects.get(client=john)

        self.assertEqual(jane.phone_number, "604-555-7676")
        self.assertEqual(john.phone_number, "604-555-4242")

        self.assertEqual(jane.last_name, john.last_name)
        self.assertEqual(jane.created_by_user_id, john.created_by_user_id)
        self.assertEqual(jane.zone, john.zone)

        self.assertEqual(jane_dis.disability, john_dis.disability)
