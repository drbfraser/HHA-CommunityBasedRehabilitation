import uuid
from django.test import TestCase
from unittest.mock import patch, MagicMock
from django.contrib.auth import get_user_model

from cbr_api.models import Client, UserCBR, Zone
from cbr_api.tests.helpers import (
    create_client,
    DetailedVisitSerializerTestsHelper as helper,
)
from cbr_api import models
from cbr_api.serializers import DetailedVisitSerializer


class DetailedVisitSerializerTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="root",
            password="root",
            zone=self.zone.id,
        )
        self.client = create_client(
            user=self.user,
            first="John",
            last="Doe",
            contact="1234567890",
            zone=self.zone,
            gender=Client.Gender.MALE,
        )

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4")
    def test_create_visit_without_improvements(self, mock_uuid, mock_now):
        mock_uuid.side_effect = [
            # visit id:
            uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        ]
        data = helper.base_visit_payload(self.client.id, self.zone.id)
        ctx = {"request": helper.mock_request(self.user)}

        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertTrue(s.is_valid(), s.errors)
        visit = s.save()

        # visit created with correct fields
        self.assertEqual(
            visit.id, uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        )
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(str(visit.client_id.id), str(self.client.id))
        self.assertEqual(visit.created_at, 1700000000000)
        self.assertEqual(visit.server_created_at, 1700000000000)

        # should no improvements since none were in payload
        self.assertEqual(models.Improvement.objects.filter(visit_id=visit).count(), 0)
