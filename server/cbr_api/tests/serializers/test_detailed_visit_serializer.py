import uuid
from django.test import TestCase
from unittest.mock import patch

from cbr_api.models import Client, Improvement, RiskType, UserCBR, Zone
from cbr_api.tests.helpers import (
    create_client,
    DetailedVisitSerializerTestsHelper as helper,
)
from cbr_api.serializers import DetailedVisitSerializer


class DetailedVisitSerializerTests(TestCase):
    def setUp(self):
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
        self.assertEqual(visit.id, uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(str(visit.client_id.id), str(self.client.id))
        self.assertEqual(visit.created_at, 1700000000000)
        self.assertEqual(visit.server_created_at, 1700000000000)

        # should no improvements since none were in payload
        self.assertEqual(Improvement.objects.filter(visit_id=visit).count(), 0)

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4")
    def test_create_visit_with_multiple_improvements(self, mock_uuid, mock_now):
        mock_uuid.side_effect = [
            # visit id
            uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            # improvement 1 id
            uuid.UUID("00000000-0000-0000-0000-000000000001"),
            # improvement 2 id
            uuid.UUID("00000000-0000-0000-0000-000000000002"),
        ]
        data = helper.base_visit_payload(self.client.id, self.zone.id) | {
            "improvements": [
                helper.improvement(
                    risk_type=RiskType.HEALTH, provided="Outcome", desc="Vitals checked"
                ),
                helper.improvement(
                    risk_type=RiskType.EDUCAT,
                    provided="School supplies",
                    desc="School follow-up",
                ),
            ]
        }
        ctx = {"request": helper.mock_request(self.user)}
        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertTrue(s.is_valid(), s.errors)
        visit = s.save()

        imps = list(Improvement.objects.filter(visit_id=visit).order_by("created_at"))
        self.assertEqual(len(imps), 2)
        self.assertEqual(imps[0].risk_type, RiskType.HEALTH)
        self.assertEqual(imps[0].provided, "Outcome")
        self.assertEqual(imps[0].desc, "Vitals checked")
        self.assertEqual(imps[0].created_at, 1700000000000)
        self.assertEqual(imps[1].risk_type, RiskType.EDUCAT)
        self.assertEqual(imps[1].provided, "School supplies")
        self.assertEqual(imps[1].desc, "School follow-up")

        # visit fields still correct
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(str(visit.client_id.id), str(self.client.id))
