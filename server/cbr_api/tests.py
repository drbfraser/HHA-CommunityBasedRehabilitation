from django.test import TestCase
from cbr_api import models

class ModelsTestCase(TestCase):
    numClients = 0

    def quickCreateClient(self, pubID, First, Last, Contact, Zone):
        self.numClients += 1
        return models.Client.objects.create(
            client_id=self.numClients, 
            public_id=pubID, 
            first_name=First, 
            last_name=Last, 
            contact_number=Contact, 
            current_zone=Zone,
            gender=False, 
            register_date=0, 
            birth_date=0, 
            current_longitude=0.0, 
            current_latitude=0.0, 
            current_village="", 
        )
        
    def setUp(self):
        zone1 = models.Zone.objects.create(zone_name="Zone 1")
        jane = self.quickCreateClient(8523, "Jane", "Smith", "604-555-7676", zone1)
        john = self.quickCreateClient(7645, "John", "Smith", "604-555-4242", zone1)
        
    def test(self):
        jane = models.Client.objects.get(first_name="Jane")
        john = models.Client.objects.get(first_name="John")
        
        self.assertEqual(jane.public_id, 8523)
        self.assertEqual(john.public_id, 7645)
        
        self.assertEqual(jane.last_name, john.last_name)
        self.assertEqual(jane.current_zone, john.current_zone)
        