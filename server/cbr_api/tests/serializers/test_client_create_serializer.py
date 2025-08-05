from django.test import TestCase
from cbr_api.models import UserCBR, Zone

class ClientCreateSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create(
            username="testuser",
            password="testpass123",
            zone=self.zone,
        )