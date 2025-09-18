from django.test import TestCase
from unittest.mock import patch, MagicMock
from django.contrib.auth import get_user_model

from cbr_api.models import Client, Zone
from cbr_api.tests.helpers import create_client


class DetailedVisitSerializerTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = User.objects.create_user(username="tester", password="x")
        self.client = create_client(
            user=self.user,
            first="John",
            last="Doe",
            contact="1234567890",
            zone=self.zone,
            gender=Client.Gender.MALE,
        )
